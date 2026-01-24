import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

// 👇 This middleware now does NOTHING except initialize the session.
// It will NOT redirect anyone, ever.
export default auth((req) => {
  return;
});

// We keep the matcher just to stop it from running on images/static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
