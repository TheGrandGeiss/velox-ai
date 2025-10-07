import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Adjust the import path as needed
import { prisma } from '@/prisma';
import { google, calendar_v3 } from 'googleapis';

const calendar = google.calendar({ version: 'v3' });

export async function GET(req: NextRequest) {
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
        { message: 'Google account not found' },
        { status: 404 }
      );
    }

    async function getEventsWithToken(
      calendarID: string,
      accessToken: string,
      refreshtoken: string
    ): Promise<calendar_v3.Schema$Event[] | null> {
      try {
        // 2. Create an OAuth2 client object and set the credentials
        const authClient = new google.auth.OAuth2(
          process.env.AUTH_GOOGLE_ID,
          process.env.AUTH_GOOGLE_SECRET
        );

        // Tell the client to use the provided access token
        authClient.setCredentials({
          access_token: accessToken,
          refresh_token: refreshtoken,
        });

        // 3. Make the API Call
        const response = await calendar.events.list({
          auth: authClient, // Pass the OAuth client for authentication
          calendarId: calendarID,
          timeMin: new Date().toISOString(), // Optional: Filter for events from now on
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        });

        // The data structure is: response.data.items
        const events = response.data.items;

        // Ensure events is an array before returning
        return events || [];
      } catch (error) {
        console.error('Google Calendar API Error:', error);
        // Returning null or throwing an error is appropriate for server-side failure
        return null;
      }
    }

    const events = await getEventsWithToken(
      'primary',
      account.access_token,
      account.refresh_token
    );

    if (!events) {
      return NextResponse.json({ message: 'no events found' });
    }

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
