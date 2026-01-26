import { googleClient } from '@/lib/actions/InitializeGoogleClient';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all events/tasks for this user's profile
    const events = await prisma.event.findMany({
      where: {
        profile: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format events to match the Event interface
    const formattedTasks = events.map((event) => ({
      id: event.id, // ✅ Added ID so you can edit/delete later
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

    return NextResponse.json(
      {
        success: true,
        tasks: formattedTasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    // 1. Get Token from Header (Frontend handles refresh)
    const token = req.headers.get('X-Google-Token');

    // 2. Create Event in Prisma FIRST (Source of Truth)
    const newEvent = await prisma.event.create({
      data: {
        title: body.eventTitle,
        description: body.eventDescription,
        start: new Date(body.start),
        end: body.end ? new Date(body.end) : null,
        category: body.category,

        // Colors
        backgroundColor: body.backgroundColor,
        borderColor: body.borderColor,
        textColor: body.textColor,

        // Connect to the user's profile
        profile: {
          connect: {
            userId: session.user.id,
          },
        },
      },
    });

    // 3. Check for Linked Google Account
    const googleAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });

    // 4. Sync to Google Calendar (Non-blocking / Safe)
    if (googleAccount && token) {
      try {
        const calendar = await googleClient(token);

        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            // We usually let Google generate its own ID to avoid format errors,
            // but we sync the rest of the data.
            summary: newEvent.title,
            description: newEvent.description,
            start: { dateTime: newEvent.start.toISOString() },
            end: {
              dateTime: newEvent.end
                ? newEvent.end.toISOString()
                : new Date(
                    newEvent.start.getTime() + 60 * 60 * 1000,
                  ).toISOString(),
            },
          },
        });
      } catch (googleError) {
        console.warn(
          'Google Sync Failed (Event saved to DB only):',
          googleError,
        );
      }
    }

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Create Event Error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 },
    );
  }
}
