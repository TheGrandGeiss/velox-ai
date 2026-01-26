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
  },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const token = req.headers.get('X-Google-Token');

    // 1. Verify the event belongs to the user
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

    // 2. Always Update Prisma (Source of Truth)
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        start: body.start,
        end: body.end,
        backgroundColor: body.backgroundColor, // Added to ensure visual consistency
        borderColor: body.borderColor,
        textColor: body.textColor,
      },
    });

    // 3. Check for linked Google Account
    const googleAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });

    // 4. Conditional Google Sync (Non-blocking)
    if (googleAccount && token) {
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
          eventId: id, // Assuming ID consistency
          requestBody: googleRequestBody,
        });
      } catch (googleError) {
        console.warn('Google Sync Failed (Non-critical):', googleError);
        // We do not throw here, so the user still gets their DB update
      }
    }

    return NextResponse.json(
      { success: true, event: updatedEvent },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Add Auth Check (Security)
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const token = req.headers.get('X-Google-Token');

    // 2. Check for linked Google Account
    const googleAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });

    // 3. Conditional Google Delete (Non-blocking)
    if (googleAccount && token) {
      try {
        const calendar = await googleClient(token);

        await calendar.events.delete({
          calendarId: 'primary',
          eventId: id,
        });
      } catch (googleError: any) {
        // Ignore 404 (already deleted) or 410 (gone)
        if (googleError.code !== 404 && googleError.code !== 410) {
          console.error(
            'Google Delete Error (Non-critical):',
            googleError.message,
          );
        }
      }
    }

    // 4. Delete from Prisma (Source of Truth)
    const deletedEvent = await prisma.event.delete({
      where: {
        id,
        // Optional: Ensure ownership here too for extra safety
        profile: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json(
      { success: true, event: deletedEvent },
      { status: 200 },
    );
  } catch (error) {
    console.error('DELETE Route Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete event',
        details: error instanceof Error ? error.message : 'Unknown',
      },
      { status: 500 },
    );
  }
}
