'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  LogOut,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatarField } from './userAvatarField';
import { signOut } from 'next-auth/react'; // Assuming next-auth for logout

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      match: (path: string) => path === '/dashboard',
    },
    {
      name: 'My Events',
      href: '/events', // This will be your list format view
      icon: Calendar,
      match: (path: string) => path.startsWith('/events'),
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      match: (path: string) => path.startsWith('/profile'),
    },
  ];

  return (
    <aside className={cn('flex flex-col h-full', className)}>
      {/* 1. PRIMARY NAVIGATION ZONE */}
      <nav className='flex-1 space-y-2 py-4'>
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
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}>
              <item.icon
                size={20}
                className={cn(
                  'transition-colors',
                  isActive
                    ? 'text-[#b591ef]'
                    : 'text-gray-500 group-hover:text-white'
                )}
              />
              <span>{item.name}</span>

              {/* Active Indicator Bar (Visual Anchor) */}
              {isActive && (
                <div className='ml-auto w-1.5 h-1.5 rounded-full bg-[#b591ef] shadow-[0_0_8px_#b591ef]' />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 2. USER UTILITY ZONE (Sticky Footer) */}
      <div
        className='mt-auto pt-4 border-t border-white/5 relative'
        ref={menuRef}>
        {/* The "Dropup" Menu */}
        {isUserMenuOpen && (
          <div className='absolute bottom-full left-0 w-full mb-3 p-1 bg-[#1c1c21] border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50'>
            <div className='flex flex-col gap-1'>
              <Link
                href='/profile'
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors'
                onClick={() => setIsUserMenuOpen(false)}>
                <User size={16} />
                Your Profile
              </Link>
              <Link
                href='/settings'
                className='flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors'
                onClick={() => setIsUserMenuOpen(false)}>
                <Settings size={16} />
                Settings
              </Link>

              <div className='h-[1px] bg-white/5 my-1' />

              <button
                onClick={() => signOut()} // Or your logout logic
                className='flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors'>
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* User Object Trigger */}
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={cn(
            'w-full flex items-center justify-between p-2 rounded-2xl transition-all border border-transparent',
            isUserMenuOpen ? 'bg-[#1c1c21] border-white/10' : 'hover:bg-white/5'
          )}>
          <div className='flex items-center gap-3 overflow-hidden'>
            {/* Reusing your Avatar Component */}
            <div className='pointer-events-none'>
              <UserAvatarField />
            </div>
          </div>
          <ChevronUp
            size={16}
            className={cn(
              'text-gray-500 transition-transform duration-200',
              isUserMenuOpen && 'rotate-180'
            )}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
