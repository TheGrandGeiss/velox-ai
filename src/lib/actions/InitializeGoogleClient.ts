'use server';

import { google } from 'googleapis';

export async function googleClient(access_token: string | null | undefined) {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: access_token }); // Use the passed token
  const calendar = google.calendar({ version: 'v3', auth: authClient });

  return calendar;
}
