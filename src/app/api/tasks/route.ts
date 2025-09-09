import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all events/tasks for this user's profile
    const events = await prisma.event.findMany({
      where: {
        profile: {
          userId: session.user?.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Format events to match the Event interface
    const formattedTasks = events.map((event) => ({
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
