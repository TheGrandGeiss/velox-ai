'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';

export async function deleteAccount() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.user.id;
  console.log(`⚠️ ATTEMPTING DELETE for User ID: ${userId}`);

  try {
    // 1. Revoke Google Token (Silent fail is okay)
    try {
      const googleAccount = await prisma.account.findFirst({
        where: { userId, provider: 'google' },
      });

      if (googleAccount?.access_token) {
        console.log('Revoking Google Token...');
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${googleAccount.access_token}`,
          {
            method: 'POST',
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
          },
        );
      }
    } catch (e) {
      console.warn('Google revocation failed (ignoring):', e);
    }

    // 2. Delete User
    console.log('Deleting User record...');
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log('✅ User Deleted Successfully');
    return { success: true };
  } catch (error: any) {
    // 🛑 LOG THE EXACT ERROR
    console.error('❌ DELETE FAILED:', error);

    // Check for Prisma constraint error
    if (error.code === 'P2003') {
      return {
        success: false,
        error:
          'Database constraint error: Missing "onDelete: Cascade" in Schema.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to delete account',
    };
  }
}
