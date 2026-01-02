'use server';
import { prisma } from '@/prisma';

export async function checkGoogleIntegration(userId: string) {
  // 1. Query the Account table
  const googleAccount = await prisma.account.findFirst({
    where: {
      userId: userId, // The user currently logged in
      provider: 'google', // The provider we are looking for
    },
    select: {
      refresh_token: true, // We only need to know if this exists
    },
  });

  // 2. The Logic Decision
  const isLinked = !!googleAccount; // True if record exists
  const hasOfflineAccess = !!googleAccount?.refresh_token; // True if we can sync in background

  return {
    isLinked: isLinked,
    isReadyToSync: isLinked && hasOfflineAccess,
  };
}
