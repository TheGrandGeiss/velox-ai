'use client';

import Sidebar from '@/components/blocks/dashboard/sidebar';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Outfit } from 'next/font/google';

// Load the font to ensure consistency
const outfit = Outfit({ subsets: ['latin'] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    // 1. Parent Container: Fixed viewport height (h-screen), dark background, flex row
    <div
      className={`flex h-screen w-full bg-[#0d0e12] overflow-hidden ${outfit.className}`}>
      {/* 2. Desktop Sidebar: Hidden on mobile (hidden), Visible on Desktop (md:block) */}
      <div className='hidden md:block w-72 h-full border-r border-white/5 bg-[#0d0e12] shrink-0'>
        <div className='h-full p-6 overflow-y-auto'>
          <Sidebar />
        </div>
      </div>

      {/* 3. Main Content Wrapper */}
      <div className='flex flex-col flex-1 h-full w-full min-w-0'>
        {/* 4. Mobile Header: Visible only on small screens */}
        <header className='md:hidden flex items-center justify-between p-4 bg-[#0d0e12] border-b border-white/5 shrink-0 z-50'>
          <h1 className='font-bold text-xl text-white tracking-tight'>
            Steady.
          </h1>

          <Sheet
            open={isMobileOpen}
            onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-white hover:bg-white/10'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-[300px] bg-[#0d0e12] border-r-white/10 text-white p-6'>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        {/* 5. The Children Container: 
             - flex-1: Fills remaining vertical space
             - overflow-hidden: Prevents window scrollbars (lets Calendar scroll internally) 
        */}
        <main className='flex-1 flex flex-col p-2 md:p-6 overflow-hidden relative'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
