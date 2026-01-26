'use server';
import { prisma } from '@/prisma';

export async function getValidAccessToken(
  userId: string | null,
): Promise<string | null> {
  if (!userId) {
    return null;
  }

  // 1. Try to find the Google Account
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google',
    },
  });

  // ✅ If no account, just return null (don't crash)
  if (!account) return null;

  // ✅ If no refresh token, we can't maintain the connection. Return null.
  if (!account.refresh_token) return null;

  // 2. Check if expired (with 1 minute buffer)
  const expiresAtMs = (account.expires_at ?? 0) * 1000;
  const isExpired = Date.now() >= expiresAtMs - 60000;

  // If token is still valid, return it immediately
  if (!isExpired && account.access_token) {
    return account.access_token;
  }

  // 3. Attempt Refresh
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
      // Log it, but don't throw. Just return null so the app continues without sync.
      console.warn('Google Token Refresh failed (Non-critical):', tokens.error);

      // Optional: If invalid_grant, it means user revoked access.
      // You might want to delete the account connection here in the future.
      return null;
    }

    const newExpiresAt = Math.floor(Date.now() / 1000 + tokens.expires_in);

    // 4. Update Database with new token
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        access_token: tokens.access_token,
        expires_at: newExpiresAt,
        refresh_token: tokens.refresh_token ?? account.refresh_token,
      },
    });

    return tokens.access_token;
  } catch (error) {
    console.error('Failed to refresh token (System Error):', error);
    // Return null so the schedule generation still happens locally
    return null;
  }
}
