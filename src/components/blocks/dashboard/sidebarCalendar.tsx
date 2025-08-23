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
      navLayout='after'
      fixedWeeks={false}
      showOutsideDays={false}
      className='w-full shadow-[0_0_5px_rgba(107,114,128,0.3)] bg-blue-50 rounded-2xl '
    />
  );
}
