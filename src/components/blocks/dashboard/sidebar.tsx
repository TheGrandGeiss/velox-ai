import { auth } from '@/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import profile from '@/assets/profile-dummy.png';
import Link from 'next/link';
import { IoIosAdd } from 'react-icons/io';
import Calendar01 from './sidebarCalendar';

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect('sign-up');
  }

  return (
    <aside className='h-screen space-y-8 p-6'>
      <div className=' px-6 py-3 bg-blue-50 w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] '>
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
            <h4 className='text-lg text-gray-800 font-semibold '>
              {session.user?.name}
            </h4>
            <p className='text-sm text-gray-400'>{session.user?.email}</p>
          </div>
        </div>
      </div>

      <Calendar01 />
      <div className='text-white px-6 py-4 bg-blue-50 w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] text-center flex justify-center items-center text-xl'>
        <Link
          href={'/dashboard/schedule'}
          className='flex gap-4 justify-center items-center text-center w-full text-gray-800'>
          <span>Create Schedule</span>
          <IoIosAdd size={30} />{' '}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
