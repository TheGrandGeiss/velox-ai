'use server';

import { auth, signIn } from '@/lib/auth';
import { prisma } from '@/prisma';
import { revalidatePath } from 'next/cache';

export async function connectGoogle() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('No session found');
  }

  // Soft Lock: Force Google to pre-fill the specific email
  await signIn('google', {
    redirectTo: '/dashboard/profile', // Redirect back to profile after linking
    authorization: {
      params: {
        login_hint: session.user.email,
        prompt: 'consent',
        access_type: 'offline',
      },
    },
  });
}

export async function disconnectGoogle() {
  const session = await auth();
  if (!session?.user?.id) return;

  // Hard Delete: Nuke the connection from the database
  await prisma.account.deleteMany({
    where: {
      userId: session.user.id,
      provider: 'google',
    },
  });

  revalidatePath('/dashboard/profile');
}
