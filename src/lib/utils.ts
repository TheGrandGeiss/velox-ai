import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { google, calendar_v3 } from 'googleapis';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. Initialize the Calendar service object once outside the function
// We don't need 'auth' here because we'll pass a different auth client for each request
const calendar = google.calendar({ version: 'v3' });

/**
 * Fetches events from a Google Calendar using a user's OAuth Access Token.
 *
 * @param calendarID The ID of the calendar to fetch events from.
 * @param accessToken The user's active OAuth Access Token.
 * @returns A promise that resolves to an array of Calendar Events or null on failure.
 */
export async function getEventsWithToken(
  calendarID: string,
  accessToken: string
): Promise<calendar_v3.Schema$Event[] | null> {
  try {
    // 2. Create an OAuth2 client object and set the credentials
    // We use a dummy client ID and secret since only the accessToken is needed for the API call
    const authClient = new google.auth.OAuth2(
      'YOUR_CLIENT_ID', // Replace with your client ID (not sensitive here)
      'YOUR_CLIENT_SECRET' // Replace with your client secret (not sensitive here)
    );

    // Tell the client to use the provided access token
    authClient.setCredentials({
      access_token: accessToken,
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
