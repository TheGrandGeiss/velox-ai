export const runtime = 'nodejs'; // Force this route to use Node.js runtime for Prisma
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { google, calendar_v3 } from 'googleapis';
import { auth } from '@/lib/auth';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user so we have their ID
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Get the guaranteed fresh Access Token using your helper
    // We pass the userId here so the helper can find the specific account
    const accessToken = await getValidAccessToken(session.user.id);

    // 3. Get event details
    const { summary, description, start, end } = await req.json();

    const event: calendar_v3.Schema$Event = {
      summary,
      description,
      start,
      end,
    };

    // 4. Helper to insert event (Simplified: Only needs Access Token now)
    async function addEvent(
      calendarID: string,
      validAccessToken: string,
      eventData: calendar_v3.Schema$Event
    ) {
      const authClient = new google.auth.OAuth2(); // No ID/Secret needed just to use a token

      authClient.setCredentials({
        access_token: validAccessToken, // <-- Just the access token is enough!
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

    // 5. Run it
    const newEvent = await addEvent(
      'primary',
      accessToken, // Passing the token we got from step 2
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
