import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: {
    signIn: '/sign-up',
    error: '/api/auth/error',
    verifyRequest: '/verify',
    newUser: '/onboarding',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;

        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });

        session.user.name = profile?.username;

        if (profile?.image) {
          session.user.image = profile.image;
        }
      }
      return session;
    },
  },

  ...authConfig,
});
