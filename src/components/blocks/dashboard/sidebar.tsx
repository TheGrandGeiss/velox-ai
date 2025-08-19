import { auth } from '@/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import profile from '@/assets/profile-dummy.png';
import { Card, CardContent } from '@/components/ui/card';
import Calendar01 from './sidebarCalendar';
import Link from 'next/link';
import { IoPencil } from 'react-icons/io5';

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect('sign-up');
  }

  return (
    <aside className='h-screen space-y-8 p-6'>
      <div className=' px-6 py-3 bg-customBG w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] '>
        <div className='flex gap-4 items-center rounded-md class w-full'>
          {' '}
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              alt='user image'
              width={55}
              height={32}
              className='rounded-full'
            />
          ) : (
            <Image
              src={profile}
              alt='user image'
              width={55}
              height={32}
              className='rounded-full'
            />
          )}
          <div>
            {' '}
            <h4 className='text-lg text-white font-semibold '>
              {session.user?.name}
            </h4>
            <p className='text-sm text-white/40'>{session.user?.email}</p>
          </div>
        </div>
      </div>

      <Calendar01 />
      <div className='text-white px-6 py-4 bg-customBG w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] text-center flex justify-center items-center text-xl'>
        <Link
          href={'/schedule'}
          className='flex gap-4 justify-center items-center text-center w-full'>
          <span>Add Schedule</span>
          <IoPencil size={24} />{' '}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
