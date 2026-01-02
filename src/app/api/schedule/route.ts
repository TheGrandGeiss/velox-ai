import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/prisma';
import { auth } from '@/lib/auth';
import { calendar_v3 } from 'googleapis';
import { googleClient } from '@/lib/actions/InitializeGoogleClient';

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

    const userProfile = await prisma.profile.findUnique({
      where: {
        userId: session?.user?.id,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'error found user unauthorized' },
        { status: 400 }
      );
    }

    // fetching existing task timestamps
    const existingEvents = await prisma.event.findMany({
      where: {
        profile: {
          userId: session?.user?.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format existing events to match the Event interface
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

    // Call genai
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Act as a professional schedule manager AI assistant. Analyze the user's tasks and preferences to create an optimal daily schedule formatted for FullCalendar. 

USER TASKS: ${content}

CURRENT DATE & TIME CONTEXT:
- Today is: ${formattedDate}
- Current time: ${currentTime}
- Current ISO timestamp: ${currentISO}
- Current date (YYYY-MM-DD): ${currentDateOnly}
- Tomorrow date (YYYY-MM-DD): ${tomorrowDateOnly}
- Tomorrow ISO timestamp: ${tomorrowISO}
- Next week date (YYYY-MM-DD): ${nextWeekDateOnly}
- Next week ISO timestamp: ${nextWeekISO}

TIME INTERPRETATION RULES:
- "today" = ${currentDateOnly}
- "tomorrow" = ${tomorrowDateOnly}
- "next week" = ${nextWeekDateOnly}
- "this week" = schedule between ${currentDateOnly} and ${nextWeekDateOnly}
- If no specific date mentioned, default to ${tomorrowDateOnly}
- All times should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ)

USER PREFERENCES:
- Main Goal: ${userProfile.mainGoal}
- Date of Birth: ${userProfile.dob}
- Wake-up Time: ${userProfile.wakeUpTime}
- Sleep Time: ${userProfile.sleepTime}
- Average Focus Period: ${userProfile.maxSessionLength}
- Weekend Preference: ${userProfile.weekendPreference}

EXISTING SCHEDULED TASKS (AVOID CONFLICTS):
${
  formattedExistingEvents.length > 0
    ? formattedExistingEvents
        .map((event, index) => {
          const startDate = new Date(event.start);
          const endDate = event.end ? new Date(event.end) : null;
          const startTime = startDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          const endTime = endDate
            ? endDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'No end time';
          const dateStr = startDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          });

          return `${index + 1}. "${event.title}" - ${dateStr} from ${startTime} to ${endTime} (${event.category})`;
        })
        .join('\n')
    : 'No existing tasks found - you have a completely free schedule.'
}

TIME CONFLICT ANALYSIS:
${
  formattedExistingEvents.length > 0
    ? `The user already has ${formattedExistingEvents.length} scheduled task(s). 
       Analyze each existing task's time period and ensure NO new tasks overlap with these times.
       Look for gaps between existing tasks or schedule on different days if necessary.`
    : "No existing tasks - you can schedule freely within the user's wake/sleep hours."
}

CONFLICT AVOIDANCE RULES:
- NEVER schedule new tasks during existing task time periods
- Check ALL existing tasks above for time conflicts
- If a time conflict exists, find alternative time slots on the same day or different days
- Maintain minimum 15-minute gaps between tasks
- Respect user's wake-up time (${userProfile.wakeUpTime}) and sleep time (${userProfile.sleepTime})

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid JSON array of objects - no other text, markdown, or explanations
2. Each object MUST have these exact keys (all required except where noted):
   - title: string (short event title)
   - description: string (detailed description)
   - start: string (ISO 8601 format)
   - end: string (ISO 8601 format, optional but recommended)
   - backgroundColor: string (hex color code based on category - lighter shade)
   - borderColor: string (hex color code based on category - darker shade)
   - textColor: string (hex color code for text, ensure contrast)
   - category: string

CATEGORY COLOR SCHEME:

- Health/Fitness: 
  * backgroundColor: #C8E6C9 (light green)
  * borderColor: #2E7D32 (dark green)
  * textColor: #1B5E20 (very dark green)

- Learning/Books: 
  * backgroundColor: #FFCDD2 (light red)
  * borderColor: #D32F2F (dark red)
  * textColor: #B71C1C (very dark red)

- Work/Productivity: 
  * backgroundColor: #BBDEFB (light blue)
  * borderColor: #1565C0 (dark blue)
  * textColor: #0D47A1 (very dark blue)

- Personal/Creative: 
  * backgroundColor: #E1BEE7 (light purple)
  * borderColor: #7B1FA2 (dark purple)
  * textColor: #4A148C (very dark purple)

- Chores/Errands: 
  * backgroundColor: #FFE0B2 (light orange)
  * borderColor: #EF6C00 (dark orange)
  * textColor: #BF360C (very dark orange)

- Social/Leisure: 
  * backgroundColor: #B2DFDB (light teal)
  * borderColor: #00695C (dark teal)
  * textColor: #004D40 (very dark teal)

- Default: 
  * backgroundColor: #F5F5F5 (light gray)
  * borderColor: #616161 (dark gray)
  * textColor: #212121 (very dark gray)

SCHEDULING RULES:
1. PRECISE TIME CALCULATION:
   - Use the exact ISO timestamps provided above for all scheduling
   - Convert user's wake-up time (${userProfile.wakeUpTime}) to ISO format for the target date
   - Convert user's sleep time (${userProfile.sleepTime}) to ISO format for the target date
   - All start/end times must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ)

2. DATE INTERPRETATION:
   - If user says "today" → use ${currentDateOnly}
   - If user says "tomorrow" → use ${tomorrowDateOnly}
   - If user says "next week" → use ${nextWeekDateOnly}
   - If no date specified → default to ${tomorrowDateOnly}

3. TIME BOUNDARIES:
   - Start no earlier than user's wake-up time: ${userProfile.wakeUpTime}
   - End no later than user's sleep time: ${userProfile.sleepTime}
   - Respect these boundaries for the target scheduling date

4. TASK BREAKDOWN:
   - Break tasks into sessions matching user's focus period: ${userProfile.maxSessionLength} minutes
   - Include 15-minute breaks between sessions
   - Apply weekend preferences: ${userProfile.weekendPreference}

5. PRIORITIZATION:
   - Consider user's main goal: ${userProfile.mainGoal}
   - Consider user's age (DOB: ${userProfile.dob}) for appropriate task difficulty
   - Schedule high-priority tasks during peak focus hours

6. TECHNICAL REQUIREMENTS:
   - Ensure events don't overlap
   - Use realistic durations (minimum 30 minutes, maximum 4 hours per session)
   - Include color coding based on task categories with proper contrast
   - All times must be valid ISO 8601 format
   - backgroundColor should be lighter than borderColor for visual hierarchy

Return a perfectly formatted JSON array that can be directly used by FullCalendar.`,
    });

    // Safe extraction with proper type checking
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates returned from Gemini API');
    }

    const firstCandidate = response.candidates[0];

    if (
      !firstCandidate.content ||
      !firstCandidate.content.parts ||
      firstCandidate.content.parts.length === 0
    ) {
      throw new Error('No content parts found in candidate response');
    }

    const firstPart = firstCandidate.content.parts[0];

    if (!firstPart.text) {
      throw new Error('No text content found in response part');
    }

    const responseText = firstPart.text;

    // Clean the response - remove markdown code blocks and trim
    let cleanJsonString = responseText.trim();

    // Remove markdown code blocks if present
    if (cleanJsonString.startsWith('```json')) {
      cleanJsonString = cleanJsonString
        .replace(/```json\n?/, '')
        .replace(/\n?```/, '');
    } else if (cleanJsonString.startsWith('```')) {
      cleanJsonString = cleanJsonString
        .replace(/```\n?/, '')
        .replace(/\n?```/, '');
    }

    // Parse the JSON string to get the array of objects
    const tasksArray = JSON.parse(cleanJsonString);

    // Validate that we got an array
    if (!Array.isArray(tasksArray)) {
      throw new Error('Expected an array from Gemini response');
    }

    // Create the AI message with all events in one transaction
    const message = await prisma.message.create({
      data: {
        role: 'ai',
        content: 'Schedule has been added, check calendar',
        profile: {
          connect: {
            id: userProfile.id,
          },
        },
      },
    });

    const userAccount = await prisma.account.findFirst({
      where: {
        userId: session?.user?.id,
      },
    });

    // Initialize Google Calendar client once (outside the loop)
    let calendar = null;
    try {
      calendar = await googleClient(userAccount?.access_token);
    } catch (googleClientError) {
      console.warn(
        'Google Client initialization failed (Non-critical):',
        googleClientError
      );
      // Continue without Google Calendar sync
    }

    // Process each task independently
    for (const task of tasksArray) {
      try {
        // 1. Create in Prisma FIRST (this should always succeed)
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
            messageId: message.id,
          },
        });

        // 2. Send THIS SPECIFIC event to Google (if connected) - wrapped in try-catch per task
        if (calendar) {
          try {
            await calendar.events.insert({
              calendarId: 'primary',
              requestBody: {
                // Don't use Prisma ID - let Google generate its own ID
                // We can store the Google ID in Prisma later if needed
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
          } catch (googleEventError) {
            console.warn(
              `Google Calendar sync failed for task "${task.title}" (Non-critical):`,
              googleEventError
            );
            // Continue to next task - DB save already succeeded
          }
        }
      } catch (prismaError) {
        console.error(
          `Failed to create event "${task.title}" in database:`,
          prismaError
        );
        // Continue to next task even if this one fails
      }
    }

    // const event:calendar_v3.Schema$Event ={
    //   summary: tasks
    // }

    // Fetch all existing events for this profile

    // Return both new tasks and all existing tasks
    return NextResponse.json({
      tasks: tasksArray,
    });
  } catch (error) {
    console.error('Error:', error);

    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON returned from AI' },
        { status: 500 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
