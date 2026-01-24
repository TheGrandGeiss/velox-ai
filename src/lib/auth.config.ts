import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export default {
  trustHost: true,
  providers: [
    Google({
      authorization:
        'https://accounts.google.com/o/oauth2/v2/auth?' +
        new URLSearchParams({
          prompt: 'consent select_account',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'openid profile email https://www.googleapis.com/auth/calendar',
        }).toString(),
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
