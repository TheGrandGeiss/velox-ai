import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define your routes
  const isAuthRoute =
    nextUrl.pathname.startsWith('/api/auth') ||
    nextUrl.pathname === '/sign-up' ||
    nextUrl.pathname === '/verify';

  // Don't redirect on auth routes
  if (isAuthRoute) {
    return;
  }

  // Add your protection logic here
  // Example: Protect certain routes
  const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL('/sign-up', nextUrl));
  }
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
