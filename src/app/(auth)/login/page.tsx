import SignIn from '@/components/blocks/login/signin';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async () => {
  const session = await auth();
  if (session) {
    redirect('/dashboard');
  }
  return (
    <>
      <SignIn />
    </>
  );
};

export default page;
