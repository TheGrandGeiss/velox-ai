'use client';

import Sidebar from '@/components/blocks/dashboard/sidebar';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    // 1. Parent Container:
    // - Changed 'h-screen' to 'min-h-screen' (allows growth).
    // - Removed 'overflow-hidden' so the browser scrollbar activates.
    <div
      className={`flex w-full bg-[#0d0e12] ${outfit.className} min-h-screen`}>
      {/* 2. Desktop Sidebar: 
          - Added 'sticky top-0 h-screen'. 
          - Since the parent scrolls, 'sticky' keeps the sidebar visible 
            while the user scrolls down the content. 
      */}
      <div className='hidden md:block w-72 border-r border-white/5 bg-[#0d0e12] shrink-0 sticky top-0 h-screen'>
        <div className='h-full p-6 overflow-y-auto'>
          <Sidebar />
        </div>
      </div>

      {/* 3. Main Content Wrapper */}
      <div className='flex flex-col flex-1 w-full min-w-0'>
        {/* 4. Mobile Header */}
        <header className='md:hidden flex items-center justify-between p-4 bg-[#0d0e12] border-b border-white/5 shrink-0 z-50 sticky top-0'>
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
              <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
              <Sidebar />
            </SheetContent>
          </Sheet>
        </header>

        {/* 5. The Children Container: 
           - Removed 'overflow-hidden'.
           - Removed 'h-full' restrictions so it grows naturally.
        */}
        <main className='flex-1 flex flex-col p-2 md:p-6 relative'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
