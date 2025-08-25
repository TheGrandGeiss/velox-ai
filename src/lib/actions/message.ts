import { prisma } from '@/prisma';
import { Message } from '../types';
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export async function saveMessageToDB(
  message: Message,
  session: string | undefined
) {
  if (!session) {
    redirect('sign-up');
  }

  if (!message) {
    throw new Error('No Message Found');
  }

  const userProfile = await prisma.profile.findUnique({
    where: {
      userId: session,
    },
  });

  if (!userProfile) {
    throw new Error('No profile found for user');
  }

  await prisma.message.create({
    data: {
      ...message,
      profile: {
        connect: {
          id: userProfile.id,
        },
      },
    },
  });
}

export const fetchMessagesFromDB = async (session: string | undefined) => {
  if (!session) {
    redirect('sign-up');
  }
  const chat = await prisma.message.findMany({
    where: {
      profile: {
        userId: session,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return chat as Message[];
};
