'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '../auth';
import { prisma } from '@/prisma';

export async function fetchEvents() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const events = await prisma.event.findMany({
    where: {
      profile: {
        userId: session.user.id,
      },
    },
    orderBy: {
      start: 'asc',
    },
  });

  return { success: true, data: events };
}

export async function toggleEventStatus(eventId: string, isComplete: boolean) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'Unauthorized' };
    }

    const response = await prisma.event.updateMany({
      where: {
        id: eventId,

        profile: {
          userId: session.user.id,
        },
      },
      data: {
        isComplete: isComplete,
      },
    });

    if (response.count === 0) {
      return { error: 'Event not found or unauthorized' };
    }

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Failed to update event status:', error);
    return { error: 'Database error' };
  }
}
