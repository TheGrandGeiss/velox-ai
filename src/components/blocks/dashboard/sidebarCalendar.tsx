'use client';

import React, { useEffect, useState } from 'react';

import { Calendar1 } from '@/components/ui/calendar-1';
import { CalendarSkeleton } from './calendarSkeleton';

export default function Calendar01() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isloaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
  });

  if (!isloaded) {
    return (
      <div>
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <Calendar1
      mode='single'
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className='rounded-md border-[0.001px]  border-white/10  w-full'
    />
  );
}
