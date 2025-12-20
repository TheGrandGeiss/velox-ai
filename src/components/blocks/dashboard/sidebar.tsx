import { auth } from '@/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import profile from '@/assets/profile-dummy.png';
import Link from 'next/link';
import { IoIosAdd } from 'react-icons/io';
import Calendar01 from './sidebarCalendar';
// import Settings from './connectGoogle';
import LogOut from './signOut';
import Click from './click';
import { UserAvatarField } from './userAvatarField';

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect('sign-up');
  }

  return (
    <aside className=' space-y-8 p-6'>
      <UserAvatarField />

      <div className='text-white px-6 py-4 bg-blue-50 w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] text-center flex justify-center items-center text-xl'>
        <Link
          href={'/schedule'}
          className='flex gap-4 justify-center items-center text-center w-full text-gray-800'>
          <span>Create Schedule</span>
          <IoIosAdd size={30} />{' '}
        </Link>
      </div>
      <Click />

      <LogOut />
    </aside>
  );
};

export default Sidebar;
