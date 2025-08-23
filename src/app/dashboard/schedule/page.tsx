import Image from 'next/image';
import React from 'react';
import image from '@/assets/schdedulepageimage.png';

const page = () => {
  return (
    <main className='h-screen'>
      <div className='flex flex-col items-center justify-center h-full'>
        {' '}
        <Image
          src={image}
          alt='ai page image'
          height={30}
          width={200}
        />
        <h4 className='text-gray-800 text-4xl pt-2'>Great, You're here!</h4>
        <p className='text-gray-500 text-2xl py-3'>
          Let&apos;s turn your tasks into a{' '}
          <span className='text-2xl'>clear schedule</span>
        </p>
      </div>
    </main>
  );
};

export default page;
