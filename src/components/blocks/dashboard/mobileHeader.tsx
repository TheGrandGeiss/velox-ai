'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Hook to track navigation
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/blocks/dashboard/sidebar';

export const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // FIX: Close sheet automatically when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className='md:hidden flex items-center justify-between p-4 bg-[#0d0e12] border-b border-white/5 shrink-0 z-50 sticky top-0'>
      <h1 className='font-bold text-xl text-white tracking-tight'>Steady.</h1>

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}>
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
          <SheetTitle className='sr-only'>Menu</SheetTitle>
          {/* Sidebar content here */}
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
};
