import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { auth } from '@/lib/auth'; // Adjust the import path as needed
import { prisma } from '@/prisma';
// Adjust the import path as needed

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // if (!session || !session.user || !session.user.email) {
    //   return NextResponse.json(
    //     { message: 'User not authenticated' },
    //     { status: 401 }
    //   );
    // }

    const account = await prisma.account.findFirst({
      where: {
        userId: session?.user?.id,
        provider: 'google',
      },
    });

    if (!account) {
      return NextResponse.json(
        { message: 'Google account not found' },
        { status: 404 }
      );
    }

    // Initialize the OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET,
      process.env.NEXTAUTH_URL
    );

    // Set the credentials
    oAuth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    // Check if the token needs to be refreshed
    if (account.expires_at && Date.now() >= account.expires_at * 1000) {
      const { credentials } = await oAuth2Client.refreshAccessToken();
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: credentials.access_token,
          expires_at: credentials.expiry_date
            ? credentials.expiry_date / 1000
            : undefined,
          refresh_token: credentials.refresh_token ?? account.refresh_token,
        },
      });
      oAuth2Client.setCredentials(credentials);
    }

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // The event data will come from your front-end
    const { summary, description, start, end } = await req.json();

    const event = {
      summary,
      description,
      start: {
        dateTime: start,
        timeZone: 'Your/TimeZone', // e.g., 'America/Los_Angeles'
      },
      end: {
        dateTime: end,
        timeZone: 'Your/TimeZone', // e.g., 'America/Los_Angeles'
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return NextResponse.json(
      { message: 'Event created', event: response.data },
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
