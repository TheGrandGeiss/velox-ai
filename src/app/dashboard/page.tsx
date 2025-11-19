import Dashboard from '@/components/blocks/dashboard/dashboard';
import React from 'react';
import './calendar.css';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  // If user is not logged in, redirect to home
  if (!session) {
    redirect('/');
  }

  return (
    <div className='flex justify-start items-start h-screen'>
      <Dashboard />
    </div>
  );
};

export default page;
