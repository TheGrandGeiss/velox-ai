import { auth } from '@/lib/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';
import profile from '@/assets/profile-dummy.png';
import { Card, CardContent } from '@/components/ui/card';
import Calendar01 from './sidebarCalendar';

const Sidebar = async () => {
  const session = await auth();

  if (!session) {
    redirect('sign-up');
  }

  return (
    <aside className='h-screen space-y-8 p-6'>
      <Card className='py-3 px-0 bg-customBG'>
        <CardContent>
          <div className='flex gap-4 items-center rounded-md'>
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
        </CardContent>
      </Card>
      <Calendar01 />
    </aside>
  );
};

export default Sidebar;
