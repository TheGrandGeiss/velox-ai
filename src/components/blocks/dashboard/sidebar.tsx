// components/blocks/dashboard/sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { UserAvatarField } from './userAvatarField';
import { getUpcomingEvents } from '@/lib/actions/getUpcomingEvents';

interface UpcomingEventsType {
  id: string;
  title: string;
  date: Date;
  color: string;
  isCompleted: boolean;
}

const Sidebar = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [upComingEvents, setUpcomingEvents] = useState<
    UpcomingEventsType[] | null
  >([]);

  useEffect(() => {
    fetchUpcoming();
    const interval = setInterval(fetchUpcoming, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUpcoming() {
    try {
      const rawEvents = await getUpcomingEvents();

      if (!rawEvents) {
        setUpcomingEvents([]);
        return;
      }

      // 1. Filter out Breaks first
      // 2. Map correct fields (fix isCompleted)
      // 3. Slice top 3
      const formattedEvents = rawEvents
        .filter((event: any) => {
          // Check if category or title indicates a break
          const category = event.category?.toLowerCase() || '';
          const title = event.title?.toLowerCase() || '';
          return category !== 'break' && title !== 'break';
        })
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          // ✅ FIX: Check both naming conventions to ensure state works
          isCompleted: !!(event.isCompleted || event.isComplete),
          date: new Date(event.start),
          color: event.backgroundColor || '#b591ef',
        }))
        .slice(0, 3); // Slice AFTER filtering to keep the list full

      setUpcomingEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events', error);
      setUpcomingEvents([]);
    }
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      match: (path: string) => path === '/dashboard',
    },
    {
      name: 'Velox AI',
      href: '/chat',
      icon: Sparkles,
      match: (path: string) => path.startsWith('/chat'),
    },
  ];

  return (
    <aside className={cn('flex flex-col h-full w-full space-y-4', className)}>
      {/* 1. LINKS */}
      <nav className='space-y-2 py-2'>
        {navItems.map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-sm',
                isActive
                  ? 'bg-[#b591ef]/10 text-[#b591ef] shadow-[0_0_20px_rgba(181,145,239,0.1)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
              )}>
              <item.icon
                size={20}
                className={cn(
                  'transition-colors',
                  isActive
                    ? 'text-[#b591ef]'
                    : 'text-gray-500 group-hover:text-white',
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 2. EVENTS WIDGET */}
      <div className='flex-1 overflow-y-auto px-1 py-4 custom-scrollbar'>
        <div className='flex items-center justify-between mb-4 px-3'>
          <h3 className='text-xs font-bold text-gray-500 uppercase tracking-widest'>
            Upcoming
          </h3>
          <Link
            href='/dashboard/events'
            className='text-[10px] font-semibold text-[#b591ef] hover:text-[#a37ce5] flex items-center gap-1 transition-colors'>
            See All <ArrowRight size={10} />
          </Link>
        </div>

        <div className='space-y-2'>
          {upComingEvents?.map((event) => (
            <div
              key={event.id}
              className={cn(
                'group flex items-start gap-3 p-3 rounded-2xl border border-transparent transition-all hover:bg-white/5',
                // Dim completed events visually
                event.isCompleted
                  ? 'opacity-50 bg-white/5'
                  : 'bg-[#1c1c21] border-white/5',
              )}>
              {/* Checkbox Icon */}
              <div className='mt-0.5 text-gray-500'>
                {event.isCompleted ? (
                  <CheckCircle2
                    size={16}
                    className='text-[#b591ef]' // Highlight checked state color
                  />
                ) : (
                  <Circle size={16} />
                )}
              </div>

              <div className='flex-1 min-w-0'>
                <p
                  className={cn(
                    'text-sm font-medium truncate leading-tight',
                    event.isCompleted
                      ? 'text-gray-500 line-through decoration-gray-600'
                      : 'text-gray-200',
                  )}>
                  {event.title}
                </p>
                <div className='flex items-center gap-2 mt-1.5'>
                  <div
                    className='w-1.5 h-1.5 rounded-full'
                    style={{ backgroundColor: event.color }}
                  />
                  <span className='text-[10px] text-gray-400 font-medium'>
                    {event.date.toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {upComingEvents && upComingEvents.length === 0 && (
            <div className='px-4 py-8 text-center border border-dashed border-white/10 rounded-2xl'>
              <p className='text-xs text-gray-500'>No upcoming tasks</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. USER MENU */}
      <div className='mt-auto pt-4 border-t border-white/5 relative'>
        {isUserMenuOpen && (
          <div className='absolute bottom-full left-0 w-full mb-2 p-1 bg-[#1c1c21] border border-white/10 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2'>
            <div className='flex flex-col gap-1'>
              <Link
                href='/dashboard/profile'
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors'>
                <Settings size={16} />
                Profile
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  redirect('/login');
                }}
                className='flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors'>
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={cn(
            'w-full flex items-center justify-between p-2 rounded-2xl transition-all border border-transparent',
            isUserMenuOpen
              ? 'bg-[#1c1c21] border-white/10'
              : 'hover:bg-white/5',
          )}>
          <div className='flex items-center gap-3 overflow-hidden pointer-events-none'>
            <UserAvatarField />
          </div>
          <ChevronUp
            size={16}
            className={cn(
              'text-gray-500 transition-transform duration-200',
              isUserMenuOpen && 'rotate-180',
            )}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
