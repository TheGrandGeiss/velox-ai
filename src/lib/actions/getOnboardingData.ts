'use server';

import { prisma } from '@/prisma';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getOnboardingData(session: Session): Promise<boolean> {
  if (!session.user) {
    redirect('login');
  }
  const onboardingDataExists = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  return !!onboardingDataExists;
}
