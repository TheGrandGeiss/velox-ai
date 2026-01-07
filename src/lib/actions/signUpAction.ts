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
    throw new Error('user already exists');
  }
  const formData = new FormData();
  formData.append('email', email);

  await signIn('resend', formData);

  return true;
};
