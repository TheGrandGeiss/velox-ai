'use server';

import { prisma } from '@/prisma';
import { userPreferenceType } from '../zodSchema/onboarding';
import { auth } from '../auth';

export async function createProfile(values: userPreferenceType) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('No user ID found in session');
  }

  if (!values) {
    throw new Error('No user inputs');
  }

  console.log(session);

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
