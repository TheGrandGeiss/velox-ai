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
        <h4 className='text-white text-4xl pt-2'>
          Welcome <span className='text-base'>Aboard</span>🚀
        </h4>
        <p className='text-white text-4xl py-3'>
          Let&apos;s turn your plans into a clear schedule
        </p>
      </div>
    </main>
  );
};

export default page;
