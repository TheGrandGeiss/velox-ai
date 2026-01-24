'use server';

import { prisma } from '@/prisma'; // Use your singleton
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

export const logInuser = async (email: string) => {
  if (!email) {
    throw new Error('Email is required');
  }

  // 1. Check if user exists (Optional, depends if you want to allow auto-signup)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return a structured error so the UI can show "User not found"
    return { error: 'No account found with this email.' };
  }

  try {
    // 2. Auth.js v5 signIn accepts a plain object or FormData
    // We pass 'redirectTo' here to ensure they land on the dashboard after clicking the email link
    await signIn('nodemailer', {
      email,
      redirectTo: '/dashboard',
    });
  } catch (error) {
    // 3. IMPORTANT: Next.js redirects throw a specific error.
    // You must re-throw it so Next.js can actually perform the redirect.
    if (error instanceof AuthError) {
      return { error: 'Something went wrong with the email provider.' };
    }
    throw error;
  }
};
