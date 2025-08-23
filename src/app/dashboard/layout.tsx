import Sidebar from '@/components/blocks/dashboard/sidebar';
import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className='flex justify-start items-start h-screen w-full gap-8 bg-white '>
        <div className='w-3/12'>
          <Sidebar />
        </div>
        <div className='w-9/12'>{children}</div>
      </div>
    </div>
  );
};

export default layout;
