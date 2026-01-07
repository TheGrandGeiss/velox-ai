import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  pages: {
    signIn: '/signup',
    error: '/api/auth/error',
    verifyRequest: '/verify',
    newUser: '/onboarding',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;

        // 👇 THE FIX: Wrap this in try/catch so it never crashes the login
        // try {
        //   const profile = await prisma.profile.findUnique({
        //     where: { userId: user.id },
        //   });

        //   if (profile) {
        //     session.user.name = profile.username;
        //     session.user.image = profile.image; // Only override if it exists
        //   }
        // } catch (error) {
        //   console.error('Database Error fetching profile:', error);

        // }
      }
      return session;
    },
  },
  ...authConfig,
});
