import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { google, calendar_v3 } from 'googleapis';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    const account = await prisma.account.findFirst({
      where: {
        userId: session?.user?.id,
        provider: 'google',
      },
    });

    if (!account?.access_token || !account.refresh_token) {
      return NextResponse.json(
        { message: 'Google account not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get event details from the request
    const { summary, description, start, end } = await req.json();

    // ✅ No need to rebuild start/end, use as-is from frontend
    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start, // Already has dateTime + timeZone
      end,
    };

    // Function to insert event using tokens
    async function addEvent(
      calendarID: string,
      accessToken: string,
      refreshToken: string,
      eventData: calendar_v3.Schema$Event
    ) {
      const authClient = new google.auth.OAuth2(
        process.env.AUTH_GOOGLE_ID,
        process.env.AUTH_GOOGLE_SECRET
      );

      authClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: authClient });

      try {
        const response = await calendar.events.insert({
          calendarId: calendarID,
          requestBody: eventData,
        });
        return response.data;
      } catch (error: any) {
        console.error('Google Calendar API Error:', error);
        throw new Error(error.message);
      }
    }

    const newEvent = await addEvent(
      'primary',
      account.access_token,
      account.refresh_token,
      event
    );

    return NextResponse.json(
      { message: '✅ Event created successfully', event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Failed to create event' },
      { status: 500 }
    );
  }
}
