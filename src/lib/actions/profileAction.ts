'use server';

import { prisma } from '@/prisma';
import { userPreferenceType } from '../zodSchema/onboarding';
import { auth } from '../auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createProfile(values: userPreferenceType) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // 1. Create the Profile and Update the User in a single transaction
  // This ensures the flag and profile are both saved or neither is.
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isOnboarded: true, // Mark them as done with onboarding
      profile: {
        create: {
          username: values.username,
          dob: values.dob,
          mainGoal: values.mainGoal,
          maxSessionLength: values.maxSessionLength,
          wakeUpTime: values.wakeUpTime,
          sleepTime: values.sleepTime,
          weekendPreference: values.weekendPreference,
        },
      },
    },
  });

  // 2. Clear cache and send them to the dashboard
  revalidatePath('/');
  redirect('/dashboard');
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
