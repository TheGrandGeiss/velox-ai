'use server';

import { prisma } from '@/prisma';
import { signIn } from '../auth';

export const createUser = async (email: string) => {
  if (!email) {
    throw new Error('Email is required');
  }
  const formData = new FormData();
  formData.append('email', email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    throw new Error('user already exists');
  }

  await signIn('resend', formData);
};
