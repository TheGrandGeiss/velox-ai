'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';

export function Calendar01() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    const today = new Date();
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    setDate(date);
  });

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
