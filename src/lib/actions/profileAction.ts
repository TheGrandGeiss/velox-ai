'use server';

import { prisma } from '@/prisma';
import { userPreferenceType } from '../zodSchema/onboarding';
import { auth } from '../auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProfile(values: userPreferenceType) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  if (!values) {
    throw new Error('No user inputs');
  }

  await prisma.profile.create({
    data: {
      username: values.username,
      dob: values.dob,
      mainGoal: values.mainGoal,
      maxSessionLength: values.maxSessionLength,
      wakeUpTime: values.wakeUpTime,
      sleepTime: values.sleepTime,
      weekendPreference: values.weekendPreference,

      user: {
        connect: { id: session.user.id },
      },
    },
  });
}

export async function getUserProfile() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: session.user?.id,
    },
  });

  if (!profile) {
    return null;
  }

  return {
    ...profile,
    dob: profile.dob.toISOString(),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export async function updateProfile(values: userPreferenceType) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!values) {
    throw new Error('No user inputs');
  }

  try {
    await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        username: values.username,
        dob: values.dob,
        mainGoal: values.mainGoal,
        // ✅ Passed directly as String since your DB expects String
        maxSessionLength: values.maxSessionLength,
        wakeUpTime: values.wakeUpTime,
        sleepTime: values.sleepTime,
        weekendPreference: values.weekendPreference,
      },
    });

    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
