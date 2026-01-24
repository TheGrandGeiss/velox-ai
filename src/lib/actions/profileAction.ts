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

// 1. Extend the type to include the image (which might not be in your Zod schema)
type ProfilePayload = userPreferenceType & {
  image?: string | null;
};

export async function updateProfile(values: ProfilePayload) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  if (!values) {
    throw new Error('No user inputs');
  }

  try {
    await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        username: values.username,
        dob: values.dob,
        mainGoal: values.mainGoal,
        maxSessionLength: values.maxSessionLength,
        wakeUpTime: values.wakeUpTime,
        sleepTime: values.sleepTime,
        weekendPreference: values.weekendPreference,
        // ✅ Update image
        image: values.image,
      },
      create: {
        userId: session.user.id,
        username: values.username,
        dob: values.dob,
        mainGoal: values.mainGoal,
        maxSessionLength: values.maxSessionLength,
        wakeUpTime: values.wakeUpTime,
        sleepTime: values.sleepTime,
        weekendPreference: values.weekendPreference,
        // ✅ Save image on creation
        image: values.image,
      },
    });

    // Revalidate both the dashboard and the specific profile page to show new image immediately
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
