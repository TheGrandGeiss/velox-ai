'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import React from 'react';

const LogOut = () => {
  async function logOut() {
    await signOut();
  }
  return (
    <button
      onClick={logOut}
      className='flex w-full px-6 py-4 text-lg gap-4 bg-red-400 text-white items-center justify-center rounded-xl'>
      <LogOutIcon className='size-6' />{' '}
      <span className='font-semibold'>Log Out</span>
    </button>
  );
};

export default LogOut;
