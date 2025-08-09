import SignUp from '@/components/blocks/signup/signUp';
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
      <SignUp />
    </>
  );
};

export default page;
