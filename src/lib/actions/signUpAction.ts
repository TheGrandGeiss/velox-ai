'use server';

import { prisma } from '@/prisma';
import { signIn } from '../auth';

export const createUser = async (email: string) => {
  if (!email) {
    throw new Error('Email is required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    throw new Error('User already exists');
  }

  // signIn with redirect option - this will send the email and redirect to verify page
  await signIn('nodemailer', {
    email,
    redirectTo: '/dashboard', // Where to go after clicking the magic link
  });
};
