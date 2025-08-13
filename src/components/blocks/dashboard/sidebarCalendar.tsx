'use client';

import React, { useEffect, useState } from 'react';

import { Calendar } from '@/components/ui/calendar';
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
    <Calendar
      mode='single'
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className='rounded-lg border shadow-sm w-full'
    />
  );
}
