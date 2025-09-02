import type { NextAuthConfig } from 'next-auth';
import Resend from 'next-auth/providers/resend';
import { Resend as ResendClient } from 'resend';
import Google from 'next-auth/providers/google';
import { prisma } from '@/prisma';

const resend = new ResendClient(process.env.AUTH_RESEND_KEY);

export default {
  trustHost: true,
  providers: [
    Google,
    Resend({
      from: 'onboarding@resend.dev',
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { from },
      }) {
        const result = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Your Magic Sign-In Link',
          html: `
  <div style="font-family: sans-serif; text-align: center; padding: 24px;">
    <p style="font-size: 16px; margin-bottom: 24px;">
      Click the button below to sign in:
    </p>
    <a href="${url}" 
       style="
         display: inline-block;
         background-color: #4B5563;
         color: white;
         padding: 16px 32px;
         font-size: 18px;
         text-decoration: none;
         border-radius: 8px;
         font-weight: bold;
       ">
      Sign In
    </a>
    <p style="font-size: 12px; color: #666; margin-top: 32px;">
      If you didn't request this, feel free to ignore it.
    </p>
  </div>
`,
        });

        if (result.error) {
          throw new Error(`Email not sent: ${result.error.message}`);
        }
      },
    }),
  ],
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
} satisfies NextAuthConfig;
