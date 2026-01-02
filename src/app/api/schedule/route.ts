import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/prisma';
import { auth } from '@/lib/auth';
import { googleClient } from '@/lib/actions/InitializeGoogleClient';
// 👇 Ensure this path matches where you saved your helper
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_AI_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'No content provided' },
        { status: 400 }
      );
    }

    // --- Date Calculations (Kept exactly as you had them) ---
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const currentTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const currentISO = date.toISOString();
    const currentDateOnly = date.toISOString().split('T')[0];
    const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowISO = tomorrow.toISOString();
    const tomorrowDateOnly = tomorrow.toISOString().split('T')[0];
    const nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekISO = nextWeek.toISOString();
    const nextWeekDateOnly = nextWeek.toISOString().split('T')[0];
    // ---------------------------------------------------------

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session?.user?.id },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Fetch Existing Events ---
    const existingEvents = await prisma.event.findMany({
      where: { profile: { userId: session?.user?.id } },
      orderBy: { createdAt: 'asc' },
    });

    const formattedExistingEvents = existingEvents.map((event) => ({
      title: event.title,
      description: event.description,
      start: event.start.toISOString(),
      end: event.end ? event.end.toISOString() : undefined,
      category: event.category,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      textColor: event.textColor,
      createdAt: event.createdAt.toISOString(),
    }));

    // --- Gemini Call ---
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Act as a professional schedule manager AI assistant...
      
      [... YOUR EXISTING PROMPT ...]

      Return a perfectly formatted JSON array that can be directly used by FullCalendar.`,
    });

    // --- Response Parsing ---
    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini');
    }

    const responseText = response.candidates[0].content.parts[0].text;
    let cleanJsonString = responseText.trim();
    if (cleanJsonString.startsWith('```json')) {
      cleanJsonString = cleanJsonString
        .replace(/```json\n?/, '')
        .replace(/\n?```/, '');
    } else if (cleanJsonString.startsWith('```')) {
      cleanJsonString = cleanJsonString
        .replace(/```\n?/, '')
        .replace(/\n?```/, '');
    }

    const tasksArray = JSON.parse(cleanJsonString);
    if (!Array.isArray(tasksArray))
      throw new Error('Expected an array from Gemini');

    // --- Create Message Record ---
    const message = await prisma.message.create({
      data: {
        role: 'ai',
        content: 'Schedule has been added, check calendar',
        profile: { connect: { id: userProfile.id } },
      },
    });

    // =========================================================
    // 🛠️ FIX STARTS HERE
    // =========================================================

    let calendarClient = null;

    // 1. Try to get a valid Google Client ONCE before the loop
    try {
      const accessToken = await getValidAccessToken(session?.user?.id!);
      if (accessToken) {
        calendarClient = await googleClient(accessToken);
      }
    } catch (e) {
      console.log('Skipping Google Sync: User not connected or token error.');
    }

    // 2. Loop through tasks
    for (const task of tasksArray) {
      // A. SAVE TO PRISMA (This happens first)
      const prismaEvent = await prisma.event.create({
        data: {
          title: task.title,
          description: task.description,
          start: new Date(task.start),
          end: task.end ? new Date(task.end) : null,
          allDay: task.allDay || false,
          backgroundColor: task.backgroundColor,
          borderColor: task.borderColor,
          textColor: task.textColor,
          category: task.category,
          profileId: userProfile.id,
          messageId: message.id, // Ensure your schema does NOT have @unique on messageId
        },
      });

      // B. SYNC TO GOOGLE (Inside its own try/catch safety bubble)
      if (calendarClient) {
        try {
          await calendarClient.events.insert({
            calendarId: 'primary',
            requestBody: {
              id: prismaEvent.id, // Using Prisma ID for consistency
              summary: task.title,
              description: task.description,
              start: { dateTime: new Date(task.start).toISOString() },
              end: {
                dateTime: task.end
                  ? new Date(task.end).toISOString()
                  : new Date(
                      new Date(task.start).getTime() + 60 * 60 * 1000
                    ).toISOString(),
              },
            },
          });
        } catch (syncError) {
          // 🛡️ CRITICAL FIX: If Google fails, we CATCH it here.
          // The loop continues, so the next event still gets saved.
          console.warn(
            `Failed to sync event "${task.title}" to Google. Error ignored.`
          );
        }
      }
    }

    // =========================================================

    return NextResponse.json({ tasks: tasksArray });
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof SyntaxError)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 500 });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
