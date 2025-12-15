import { auth } from '@/lib/auth';
import { googleClient } from '@/lib/actions/InitializeGoogleClient';
import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const token = req.headers.get('X-Google-Token');

    // Verify the event belongs to the user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        profile: {
          userId: session.user.id,
        },
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update Google Calendar if token exists
    if (token) {
      try {
        const calendar = await googleClient(token);

        const googleRequestBody: any = {};
        if (body.title) googleRequestBody.summary = body.title;
        if (body.description) googleRequestBody.description = body.description;
        if (body.start)
          googleRequestBody.start = {
            dateTime: new Date(body.start).toISOString(),
          };
        if (body.end)
          googleRequestBody.end = {
            dateTime: new Date(body.end).toISOString(),
          };

        await calendar.events.patch({
          calendarId: 'primary',
          eventId: id, // Using Prisma ID
          requestBody: googleRequestBody,
        });
      } catch (googleError) {
        console.warn('Google Sync Failed:', googleError);
      }
    }

    // Update Prisma
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        start: body.start,
        end: body.end,
      },
    });

    return NextResponse.json(
      { success: true, event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 requires awaiting params
) {
  try {
    const { id } = await params;
    const token = req.headers.get('X-Google-Token');

    // 1. Try to delete from Google Calendar FIRST (if token exists)
    if (token) {
      try {
        const calendar = await googleClient(token);

        await calendar.events.delete({
          calendarId: 'primary',
          eventId: id,
        });
      } catch (googleError: any) {
        if (googleError.code !== 404 && googleError.code !== 410) {
          console.error('Google Delete Error (Non-critical):', googleError);
        }
      }
    }

    // 2. Delete from Prisma (Database)
    // We do this last to ensure our local DB is the "source of truth"
    const deletedEvent = await prisma.event.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { success: true, event: deletedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE Route Error:', error);

    // Return a proper JSON error so the frontend doesn't crash
    return NextResponse.json(
      {
        error: 'Failed to delete event',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 }
    );
  }
}
