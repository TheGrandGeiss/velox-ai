// src/lib/actions/getUpcomingEvents.ts
'use server';

import { prisma } from '@/prisma';
import { auth } from '@/lib/auth';

export async function getUpcomingEvents() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const now = new Date();

  const upcomingEvents = await prisma.event.findMany({
    where: {
      profile: { userId: session.user.id },
      start: {
        gte: now,
      },
    },
    orderBy: {
      start: 'asc',
    },
    take: 3,
  });

  return upcomingEvents;
}
