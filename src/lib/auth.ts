import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';

import nodemailer from 'nodemailer';
import { prisma } from '@/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 👇 ADD THIS - Critical for cookie handling
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {
    signIn: '/signup',
    error: '/api/auth/error',
    verifyRequest: '/verify',
    newUser: '/onboarding',
  },

  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnboarded = auth?.user.isOnboarded;
      const { pathname } = nextUrl;

      // 1. Allow access to public assets and Auth API routes
      if (pathname.startsWith('/api/auth') || pathname.startsWith('/public')) {
        return true;
      }

      // 2. LOGIC: If the user is logged in
      if (isLoggedIn) {
        // A. If they haven't finished onboarding, force them to stay on /onboarding
        if (!isOnboarded && pathname !== '/onboarding') {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }

        // B. If they ARE finished, prevent them from going back to /onboarding
        if (isOnboarded && pathname === '/onboarding') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

        return true; // Let them through to any other page
      }

      // 3. If they are NOT logged in, return 'false'
      // (This automatically redirects them to your 'pages.signIn' URL)
      return false;
    },

    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;

        try {
          const profile = await prisma.profile.findUnique({
            where: { userId: user.id },
          });

          if (profile) {
            session.user.name = profile.username;
            session.user.image = profile.image;
          }
        } catch (error) {
          console.error('Database Error fetching profile:', error);
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  providers: [
    ...authConfig.providers,
    {
      id: 'nodemailer',
      type: 'email',
      name: 'Nodemailer',
      server: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const transport = nodemailer.createTransport(provider.server);

        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: 'Sign in to Velox AI',
          text: `Sign in to Velox AI\n\nPlease click the link below to sign in:\n\n${url}\n\nThis link expires in 24 hours.`,
          html: `
              <body style="background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <div style="background-color: #ffffff; padding: 40px 30px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0;">Velox AI</h1>
                    </div>
                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; text-align: center; margin-bottom: 30px;">
                      Hello! Click the button below to securely sign in to your account.
                    </p>
                    <div style="text-align: center; margin-bottom: 30px;">
                      <a href="${url}" target="_blank" style="background-color: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                        Sign In
                      </a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                    <p style="color: #9ca3af; font-size: 13px; line-height: 20px; text-align: center; margin: 0;">
                      If you didn't request this, feel free to ignore it.
                    </p>
                  </div>
                </div>
              </body>
            `,
        });
      },
    },
  ],
});
