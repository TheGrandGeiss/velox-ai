'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

export function UserAvatarField() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className='flex items-center gap-3 w-full'>
        <Skeleton className='h-10 w-10 rounded-full bg-white/10' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-3 w-24 bg-white/10' />
          <Skeleton className='h-2 w-32 bg-white/10' />
        </div>
      </div>
    );
  }

  // If no user, just render nothing (don't redirect inside a component!)
  if (!session?.user) return null;

  return (
    <div className='flex items-center gap-3 text-left min-w-0'>
      <Avatar className='h-9 w-9 border border-white/10'>
        <AvatarImage src={session.user.image || ''} />
        <AvatarFallback className='bg-purple-600 text-white text-xs'>
          {session.user.name?.slice(0, 2).toUpperCase() || 'US'}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col min-w-0 overflow-hidden'>
        <span className='text-sm font-medium text-white truncate leading-none mb-1'>
          {session.user.name}
        </span>
        <span className='text-[10px] text-gray-400 truncate leading-none font-medium'>
          {session.user.email}
        </span>
      </div>
    </div>
  );
}
