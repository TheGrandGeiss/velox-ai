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
    await signIn('nodemailer', {
      email,
      // redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Something went wrong with the email provider.' };
    }
    throw error;
  }
};
