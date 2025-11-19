import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main>
      Steady web app bitchhhhhhh
      <Link href={'/sign-up'}>Sign up</Link>
    </main>
  );
}
