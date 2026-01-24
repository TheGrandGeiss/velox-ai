// next-auth.d.ts
import { DefaultSession } from 'next-auth';
import { AdapterUser as BaseAdapterUser } from '@auth/core/adapters';

declare module 'next-auth' {
  // 1. Extend the Session user (for auth() and useSession() calls)
  interface Session {
    user: {
      id: string;
      isOnboarded: boolean;
    } & DefaultSession['user'];
  }

  // 2. Extend the User interface (for general Auth.js use)
  interface User {
    isOnboarded: boolean;
  }
}

declare module '@auth/core/adapters' {
  // 3. 🔑 THIS IS THE KEY: Extend the AdapterUser
  // This tells TypeScript that the 'user' object in the session callback
  // actually contains your custom MongoDB fields.
  interface AdapterUser extends BaseAdapterUser {
    isOnboarded?: boolean;
  }
}
