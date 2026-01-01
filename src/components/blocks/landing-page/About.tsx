'use client';

import { Outfit } from 'next/font/google';
import Image from 'next/image';
import profilePic from '@/assets/profile.jpg';
import Link from 'next/link';

const outfit = Outfit({ subsets: ['latin'] });

const About = () => {
  return (
    <section
      id='about'
      // CHANGED: md:py-24 -> lg:py-24 (Tablets now keep the py-16 padding)
      className={`py-16 lg:py-24 bg-[#f5f6f7] ${outfit.className}`}>
      <div className='max-w-6xl mx-auto px-6'>
        {/* CHANGED: md:gap-16 -> lg:gap-16 */}
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
          {/* 1. The Image Side */}
          {/* CHANGED: md:w-1/2 -> lg:w-1/2 and md:justify-end -> lg:justify-end */}
          <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
            {/* CHANGED: md sizes -> lg sizes (Tablets keep the 64px size) */}
            <div className='relative w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500'>
              <Image
                src={profilePic}
                alt='Developer of Velox'
                fill
                className='object-cover'
                placeholder='blur'
              />
            </div>
          </div>

          {/* 2. The Text Side */}
          {/* CHANGED: md:text-left -> lg:text-left (Tablets stay centered) */}
          <div className='w-full lg:w-1/2 text-center lg:text-left'>
            {/* The Badge */}
            <div className='inline-block px-5 py-1.5 mb-6 border border-gray-200 rounded-full bg-gray-50'>
              {/* CHANGED: md:text-sm -> lg:text-sm */}
              <h3 className='text-violet font-medium tracking-wide text-xs lg:text-sm'>
                About the Developer
              </h3>
            </div>

            {/* CHANGED: md:text-4xl -> lg:text-4xl */}
            <h2 className='text-3xl lg:text-4xl font-bold text-[#262626] mb-6 leading-tight'>
              Building the tool I wish I had.
            </h2>

            {/* CHANGED: md:text-lg -> lg:text-lg */}
            <div className='space-y-4 text-base lg:text-lg text-gray-600 leading-relaxed'>
              <p>
                Hi, I&apos;m Emmanuel Chidera. I&apos;m a software engineer
                based in Nigeria.
              </p>
              <p>
                Velox started as a weekend project. I found myself spending more
                time
                <i> organizing</i> my week than actually getting work done. I
                realized that most calendar apps are just digital paper—they
                don&apos;t actually help you.
              </p>
              <p>
                So I decided to code the solution. Velox is my attempt to use AI
                to buy us all a little more free time. No corporate bloat, no
                investors—just code written with passion.
              </p>
            </div>

            {/* Social / Contact Links */}
            {/* CHANGED: md:justify-start -> lg:justify-start (Tablets stay centered) */}
            <div className='mt-8 flex justify-center lg:justify-start gap-4'>
              <Link
                href='https://x.com/ChideraEbenebe'
                className='text-[#262626] font-semibold border-b-2 border-violet hover:text-violet transition-colors'>
                Follow my journey &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
