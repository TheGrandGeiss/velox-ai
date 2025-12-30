'use server';
import { prisma } from '@/prisma';

export async function getValidAccessToken(userId: string) {
  if (!userId) {
    throw new Error('no user');
  }
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google',
    },
  });

  if (!account) throw new Error('No Google account linked');
  if (!account.refresh_token) throw new Error('No refresh token available');

  // Check if expired (with 1 minute buffer)
  const expiresAtMs = (account.expires_at ?? 0) * 1000;
  const isExpired = Date.now() >= expiresAtMs - 60000;

  if (!isExpired && account.access_token) {
    return account.access_token;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: account.refresh_token,
      }),
    });

    const tokens = await response.json();

    if (!response.ok) {
      // 🚨 CHECK SPECIFIC ERRORS HERE
      if (tokens.error === 'invalid_grant') {
        console.error(
          '❌ Refresh Token Invalid (Revoked or Expired). User must re-login.'
        );
        // Optional: You could delete the invalid token from DB here to force a clean slate
        // await prisma.account.update({ where: { id: account.id }, data: { refresh_token: null } });
        throw new Error('Refresh token expired');
      }

      if (tokens.error === 'invalid_client') {
        console.error('❌ Wrong Client ID or Secret in .env file');
        throw new Error('Configuration error');
      }

      throw tokens; // Throw unknown errors
    }

    const newExpiresAt = Math.floor(Date.now() / 1000 + tokens.expires_in);

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: tokens.access_token,
        expires_at: newExpiresAt,
        // Google might verify a new refresh token, but often it's undefined in a refresh response
        refresh_token: tokens.refresh_token ?? account.refresh_token,
      },
    });

    return tokens.access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Returning null or throwing specific error helps the frontend know to redirect to login
    throw new Error('Failed to refresh access token');
  }
}
