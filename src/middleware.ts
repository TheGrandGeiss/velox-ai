// ✅ GOOD: Imports ONLY the config (No Prisma, No Database)
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config"; // 👈 Ensure this points to the config file

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // your middleware logic
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};