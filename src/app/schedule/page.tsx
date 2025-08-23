import Image from 'next/image';
import React from 'react';
import image from '@/assets/schdedulepageimage.png';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import ChatBotMessageField from '@/components/blocks/dashboard/textarea';

const page = () => {
  return (
    <main className='bg-gray-50 '>
      <div className='min-h-screen  flex flex-col max-w-[1300px] mx-auto'>
        {/* Header with back button */}
        <div className='p-6'>
          <Link href={'/dashboard'}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full bg-calprimary text-white'>
              <ArrowLeft className='h-8 w-8' />
            </Button>
          </Link>
        </div>

        {/* Main content - centered */}
        <div className='flex-1 flex flex-col items-center justify-center px-6 -mt-16'>
          <div className='max-w-md text-center space-y-6'>
            {/* Image */}
            <div className='mb-8'>
              <Image
                src={image}
                alt='Schedule page image'
                width={200}
                height={200}
                className='mx-auto'
              />
            </div>

            {/* Text content */}
            <div className='space-y-4'>
              <h1 className='text-4xl font-bold text-gray-900'>
                Welcome to TaskFlow
              </h1>
              <p className='text-xl text-gray-600'>
                Ready to organize your day? Tell me what you need to do and{' '}
                <span className='font-semibold text-gray-800'>
                  I'll create your perfect schedule
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom textarea */}
        <div className='p-6 pt-0'>
          <div className='max-w-3xl mx-auto'>
            <ChatBotMessageField />
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
