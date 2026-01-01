'use client';

import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

const Mission = () => {
  return (
    <section
      id='mission'
      // UPDATED: Reduced padding on mobile (py-16), larger on desktop (md:py-24)
      className={`py-16 md:py-24 bg-[#f5f6f7] ${outfit.className}`}>
      <div className='max-w-4xl mx-auto px-6 text-center'>
        {/* The "Pill" Badge */}
        <div className='inline-block px-5 py-1.5 mb-6 md:mb-8 border border-gray-200 rounded-full bg-white shadow-sm'>
          <h3 className='text-violet font-medium tracking-wide text-xs md:text-sm'>
            Our Mission
          </h3>
        </div>

        {/* Main Headline */}
        {/* UPDATED: text-3xl on mobile -> text-5xl on desktop */}
        <h2 className='text-3xl md:text-5xl font-bold text-[#262626] mb-6 md:mb-8 leading-tight'>
          To make daily planning invisible, so you can focus on{' '}
          <span className='text-violet'>becoming your best self.</span>
        </h2>

        {/* Body Text */}
        {/* UPDATED: text-base on mobile -> text-xl on desktop */}
        <p className='text-base md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto'>
          We know the struggle: you start the year with big hopes, but the
          friction of organizing your day slowly kills your momentum. We built
          Velox to remove that friction. We automate the tedious work of
          scheduling so you can stop managing your time and start mastering it.
        </p>

        {/* Divider */}
        <div className='mt-10 md:mt-12 flex justify-center'>
          <div className='h-1 w-20 bg-gray-300 rounded-full'></div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
