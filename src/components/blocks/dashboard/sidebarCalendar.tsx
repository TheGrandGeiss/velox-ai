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
      navLayout='after'
      fixedWeeks={false}
      showOutsideDays={false}
      className='rpx-6 py-4 bg-customBG w-full rounded-2xl shadow-[0_0_5px_rgba(107,114,128,0.3)] shadow-gray-500/30'
    />
  );
}
