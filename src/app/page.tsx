import Home from '@/components/blocks/landing-page/home';
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
      <Home />
    </>
  );
};

export default page;
