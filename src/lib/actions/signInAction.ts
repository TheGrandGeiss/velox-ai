'use server';

import { signIn } from '@/lib/auth';
import { prisma } from '@/prisma'; // Adjust your path
import { AuthError } from 'next-auth';

export async function loginWithEmail(email: string) {
  try {
    // 1. 🔍 THE CHECK: Does this email exist?
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }, // Always normalize emails
    });

    if (!existingUser) {
      // ❌ Return a custom error so the UI can show a Toast
      return { success: false, error: 'No account found with this email.' };
    }

    // 2. ✅ If user exists, proceed with Magic Link
    await signIn('nodemailer', {
      email,
      redirectTo: '/dashboard',
    });

    // Note: signIn usually throws a redirect error, so code rarely reaches here
    return { success: true };
  } catch (error) {
    // ⚠️ CRITICAL: Next.js redirects work by throwing errors.
    // We must re-throw "NEXT_REDIRECT" errors, or the redirect will break.
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error(error);

    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.cause?.err?.message || 'Authentication failed',
      };
    }

    return { success: false, error: 'Something went wrong' };
  }
}
