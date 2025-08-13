import { Skeleton } from '@/components/ui/skeleton';

export function CalendarSkeleton() {
  return (
    <div className='rounded-lg border shadow-sm w-full p-4 space-y-4'>
      {/* Month + Year header */}
      <div className='flex justify-between'>
        <Skeleton className='h-6 w-6 rounded-full' /> {/* Left arrow */}
        <Skeleton className='h-6 w-24' /> {/* Month + Year */}
        <Skeleton className='h-6 w-6 rounded-full' /> {/* Right arrow */}
      </div>

      {/* Days of week row */}
      <div className='grid grid-cols-7 gap-2'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-4 w-8'
          />
        ))}
      </div>

      {/* Dates grid */}
      <div className='grid grid-cols-7 gap-2'>
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton
            key={i}
            className='h-10 w-10 rounded-md'
          />
        ))}
      </div>
    </div>
  );
}
