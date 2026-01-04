'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleEventStatus } from '@/lib/actions/events';

interface EventData {
  id: string;
  profileId: string;
  createdAt: Date;
  title: string;
  description: string | null;
  start: Date;
  end: Date | null;
  allDay: boolean;
  backgroundColor: string | null;
  borderColor: string | null;
  category: string | null;
  textColor: string | null;
  isComplete: boolean | null;
  messageId: string | null;
}

interface EventListProps {
  events: {
    success: boolean;
    data: EventData[] | null;
    error?: string;
  };
}

const EventList = ({ events }: EventListProps) => {
  // 1. Filter State ('all' | 'pending' | 'completed')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  if (!events.success || !events.data) return null;

  // 2. THE FILTER LOGIC
  const visibleEvents = useMemo(() => {
    return events.data!.filter((event) => {
      // Rule A: Always remove 'break' category (case-insensitive check)
      const isBreak = event.category?.toLowerCase() === 'break';
      if (isBreak) return false;

      // Rule B: Apply UI Filter
      if (filter === 'pending') return !event.isComplete;
      if (filter === 'completed') return event.isComplete;

      return true; // 'all'
    });
  }, [events.data, filter]);

  return (
    <div className='space-y-6'>
      {/* Header + Filter Controls */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <h2 className='text-2xl font-bold text-white tracking-tight'>
            Your Schedule
          </h2>
          <span className='bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-zinc-700'>
            {visibleEvents.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className='flex p-1 bg-zinc-900 rounded-lg border border-zinc-800 w-full sm:w-auto'>
          {(['all', 'pending', 'completed'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={cn(
                'flex-1 sm:flex-none px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize',
                filter === option
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              )}>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State for Filter */}
      {visibleEvents.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30'>
          <div className='bg-zinc-800/50 p-3 rounded-full mb-3'>
            <Filter className='w-5 h-5 text-zinc-500' />
          </div>
          <p className='text-zinc-400 text-sm'>
            No {filter === 'all' ? '' : filter} events found.
          </p>
        </div>
      ) : (
        <div className='grid gap-4'>
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ... (The EventCard component remains exactly the same as previous step) ...
const EventCard = ({ event }: { event: EventData }) => {
  const [isComplete, setIsComplete] = useState(!!event.isComplete);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStatusToggle = (newValue: string) => {
    const newStatus = newValue === 'true';
    setIsComplete(newStatus);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      console.log(`Saving to DB: Event ${event.id} is now ${newStatus}`);
      await toggleEventStatus(event.id, newStatus);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const formatTimeRange = (start: Date, end: Date | null, allDay: boolean) => {
    if (allDay) return 'All Day';
    const startTime = format(new Date(start), 'h:mm a');
    return end
      ? `${startTime} - ${format(new Date(end), 'h:mm a')}`
      : startTime;
  };

  const categoryColor = event.backgroundColor || '#8b5cf6';

  return (
    <div
      className={cn(
        'group relative flex flex-col lg:flex-row bg-[#18181b] rounded-xl border transition-all duration-200 overflow-hidden',
        isComplete
          ? 'border-zinc-800 opacity-60'
          : 'border-zinc-800 hover:border-violet-500/50'
      )}>
      <div
        className='hidden lg:block w-1.5 shrink-0'
        style={{ backgroundColor: categoryColor }}
      />

      <div className='flex flex-1 p-5 gap-5 items-start'>
        <div className='hidden sm:flex flex-col items-center justify-center bg-zinc-900 rounded-lg h-14 w-14 shrink-0 border border-zinc-800 text-zinc-400'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-zinc-500'>
            {format(new Date(event.start), 'MMM')}
          </span>
          <span className='text-lg font-bold text-white'>
            {format(new Date(event.start), 'd')}
          </span>
        </div>

        <div className='flex-1 min-w-0 flex flex-col gap-1'>
          <div className='flex flex-col-reverse lg:flex-row lg:items-center justify-between gap-2 mb-1'>
            <h3
              className={cn(
                'font-semibold text-lg truncate transition-all',
                isComplete ? 'text-zinc-500 line-through' : 'text-white'
              )}>
              {event.title}
            </h3>

            {event.category && (
              <span
                className='self-start lg:self-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide border'
                style={{
                  color: categoryColor,
                  borderColor: `${categoryColor}33`,
                  backgroundColor: `${categoryColor}1A`,
                }}>
                {event.category}
              </span>
            )}
          </div>

          <div className='space-y-1'>
            <p className='text-sm text-zinc-400 flex items-center gap-2'>
              <Clock className='w-3.5 h-3.5 text-zinc-500' />
              {formatTimeRange(event.start, event.end, event.allDay)}
            </p>
            {event.description && (
              <p className='text-sm text-zinc-500 line-clamp-2 leading-relaxed'>
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-900/50 lg:bg-transparent px-5 py-3 lg:pr-5 lg:w-48'>
        <div className='flex flex-col gap-1 w-full lg:w-auto'>
          <label className='text-[10px] uppercase tracking-wider text-zinc-500 font-semibold lg:hidden'>
            Status
          </label>
          <div className='relative'>
            <select
              value={isComplete.toString()}
              onChange={(e) => handleStatusToggle(e.target.value)}
              className={cn(
                'w-full appearance-none pl-9 pr-8 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer',
                isComplete
                  ? 'bg-zinc-900 border-zinc-800 text-green-500'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
              )}>
              <option value='false'>Pending</option>
              <option value='true'>Completed</option>
            </select>

            <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none'>
              {isComplete ? (
                <CheckCircle2 className='w-4 h-4 text-green-500' />
              ) : (
                <Circle className='w-4 h-4 text-zinc-400' />
              )}
            </div>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
              <ChevronDown className='w-3 h-3 text-zinc-500' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
