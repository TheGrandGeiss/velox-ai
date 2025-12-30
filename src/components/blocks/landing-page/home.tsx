'use client';

import { Shrikhand, Outfit, Permanent_Marker } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';
import { IoMdClose, IoMdMenu } from 'react-icons/io';

const permanentMarker = Permanent_Marker({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin'],
  style: ['normal'],
});
const shrikhand = Shrikhand({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin'],
  style: ['normal'],
});

const outfit = Outfit({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin'],
  style: ['normal'],
});

const navLinks = [
  { id: 1, text: 'Features', href: '#features' },
  { id: 2, text: 'Our Mission', href: '#mission' },
  { id: 3, text: 'About Us', href: '#about' },
  { id: 4, text: 'FAQ', href: '#faq' },
];

const Home = () => {
  const [open, setOpen] = useState(false);

  return (
    <main className={outfit.className}>
      {/* 1. Added relative and z-50 to keep header on top of the mobile menu */}
      <nav className='text-[#262626] sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-6'>
          <section className='flex items-center py-4'>
            {/* Logo Section */}
            <div className='flex-1 flex justify-start'>
              <div className={`${shrikhand.className} text-2xl relative z-50`}>
                Velox
              </div>
            </div>

            {/* Desktop Links */}
            <ul className='hidden lg:flex gap-6 items-center'>
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className='group relative'>
                  <li>{link.text}</li>
                  <div className='h-[2px] w-0 bg-violet rounded-md group-hover:w-full transition-all duration-300 absolute -bottom-1 left-0'></div>
                </Link>
              ))}
            </ul>

            {/* Desktop Buttons */}
            <div className='hidden lg:flex flex-1 justify-end items-center gap-4'>
              <Link
                href={'#pricing'}
                className='group relative'>
                <span>Pricing</span>
                <div className='h-[2px] w-0 bg-violet rounded-md group-hover:w-full transition-all duration-300 absolute -bottom-1 left-0'></div>
              </Link>

              <button className='bg-[#262626] text-[#f5f6f7] rounded-full py-3 px-8 hover:bg-opacity-90 transition-opacity'>
                Get Started
              </button>
            </div>

            {/* Mobile Toggle Button */}

            <div className='lg:hidden flex-1 flex justify-end z-50 relative'>
              <button onClick={() => setOpen((prev) => !prev)}>
                {open ? <IoMdClose size={28} /> : <IoMdMenu size={28} />}
              </button>
            </div>
          </section>
        </div>

        {/* 2. Mobile Menu Overlay */}
        <div
          className={`fixed top-0 left-0 w-full bg-white z-40 overflow-hidden transition-[height] duration-500 ease-in-out ${
            open ? 'h-screen' : 'h-0'
          }`}>
          {/* Container for links - padding top moves it below the header */}
          <div className='flex flex-col px-6 pt-24 h-full'>
            <ul className='flex flex-col w-full'>
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className='w-full border-b border-gray-200'>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className='block py-5 text-xl font-bold text-[#262626] hover:text-violet transition-colors'>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Button - Full Width */}
            <div
              className='mt-8 w-full'
              onClick={() => setOpen(false)}>
              <button className='bg-[#262626] text-[#f5f6f7] w-full rounded-full py-4 text-lg font-medium hover:bg-opacity-90 transition-opacity'>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header
        className={`max-w-6xl mx-auto py-10 ${outfit.className} antialiased`}>
        <section>
          <h2 className='text-6xl text-balance text-center [word-spacing:8px] leading-20'>
            <span className={`${permanentMarker.className} antialiased`}>
              Supercharge
            </span>{' '}
            Your Day With AI Personal Assistant
          </h2>
        </section>
      </header>
    </main>
  );
};

export default Home;
