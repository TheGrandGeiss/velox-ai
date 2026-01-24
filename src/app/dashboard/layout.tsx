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
import { getOnboardingData } from '@/lib/actions/getOnboardingData';

const outfit = Outfit({ subsets: ['latin'] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className={`flex w-full bg-[#0d0e12] ${outfit.className} min-h-screen`}>
      <div className='hidden lg:block w-72 border-r border-white/5 bg-[#0d0e12] shrink-0 sticky top-0 h-screen'>
        <div className='h-full p-6 overflow-y-auto custom-scrollbar'>
          <Sidebar />
        </div>
        npm
      </div>

      {/* Main Content Wrapper */}
      <div className='flex flex-col flex-1 w-full min-w-0'>
        {/* FIX 2: CHANGED 'md:hidden' TO 'lg:hidden'
           This shows the Hamburger Menu on Tablets now.
        */}
        <header className='lg:hidden flex items-center justify-between p-4 bg-[#0d0e12] border-b border-white/5 shrink-0 z-50 sticky top-0'>
          <h1 className='font-bold text-xl text-white tracking-tight'>Velox</h1>

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

            {/* SheetContent is the "Slide-over" drawer */}
            <SheetContent
              side='left'
              className='w-[300px] bg-[#0d0e12] border-r-white/10 text-white p-0'>
              <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
              {/* Added padding inside the scroll area, not the sheet wrapper */}
              <div className='h-full p-6 overflow-y-auto'>
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className='flex-1 flex flex-col p-2 md:p-6 relative'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
