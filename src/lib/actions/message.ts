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

  // Validate required fields for Prisma Message model
  if (!message.content) {
    throw new Error('Message content is required');
  }

  await prisma.message.create({
    data: {
      role: message.role,
      content: message.content,
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

  // Map Prisma Message to TypeScript Message type
  return chat.map((message) => ({
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.createdAt,
    start: message.createdAt.toISOString(), // Use createdAt as fallback for required start field
  })) as Message[];
};
