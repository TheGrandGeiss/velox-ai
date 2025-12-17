'use server';
import { prisma } from '@/prisma';

export async function getValidAccessToken(userId: string) {
  if (!userId) {
    alert('no user');
  }
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google',
    },
  });

  if (!account) throw new Error('No Google account linked');
  if (!account.refresh_token) throw new Error('No refresh token available');

  const expiresAtMs = (account.expires_at ?? 0) * 1000;
  const isExpired = Date.now() >= expiresAtMs - 60000;

  if (!isExpired && account.access_token) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error('No refresh token');
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

    const token = await response.json();

    if (!response.ok) throw token;

    const newExpiresAt = Math.floor(Date.now() / 1000 + token.expires_in);

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: token.access_token,
        expires_at: newExpiresAt,
        refresh_token: token.refresh_token ?? account.refresh_token,
      },
    });

    return token.access_token;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw new Error('Failed to refresh access token');
  }
}
