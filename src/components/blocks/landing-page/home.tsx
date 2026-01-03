'use client';

import { Shrikhand, Outfit, Kalam } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import hero from '@/assets/heroImage.webp';
import { useState, useEffect } from 'react';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import Features from './Features';
import Mission from './Mission';
import About from './About';
import FAQ from './FAQ';
import Pricing from './Pricing';
import Footer from './Footer';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const kalam = Kalam({
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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Effect to listen for scroll events
  useEffect(() => {
    if (session?.user?.id) {
      redirect('dashboard');
    }
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={outfit.className}>
      {/* Navbar Logic */}
      <nav
        className={`text-[#262626] fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#262626] shadow-md py-3 text-[#f5f6f7]'
            : 'bg-[#f5f6f7] py-4 md:py-5'
        }`}>
        <div className='max-w-6xl mx-auto px-6'>
          <section className='flex items-center justify-between'>
            {/* Logo Section */}
            <div className='flex-1 flex justify-start'>
              <div
                className={`${shrikhand.className} text-2xl md:text-3xl relative z-50`}>
                Velox
              </div>
            </div>

            {/* Desktop Links */}
            <div className='hidden lg:flex gap-8 items-center'>
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className='group relative text-sm font-medium tracking-wide'>
                  <span>{link.text}</span>
                  <div className='h-[2px] w-0 bg-violet rounded-md group-hover:w-full transition-all duration-300 absolute -bottom-1 left-0'></div>
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}
            <div className='hidden lg:flex flex-1 justify-end items-center gap-6'>
              <Link
                href={'#pricing'}
                className='group relative text-sm font-medium'>
                <span>Pricing</span>
                <div className='h-[2px] w-0 bg-violet rounded-md group-hover:w-full transition-all duration-300 absolute -bottom-1 left-0'></div>
              </Link>

              <button
                onClick={() => router.push('/signup')}
                className='bg-violet text-[#f5f6f7] rounded-full py-2.5 px-6 hover:bg-opacity-90 transition-opacity font-medium shadow-lg shadow-violet/20'>
                Sign Up
              </button>
            </div>

            {/* Mobile Toggle Button */}
            <div className='lg:hidden flex justify-end z-50 relative'>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className='p-2'>
                {open ? <IoMdClose size={28} /> : <IoMdMenu size={28} />}
              </button>
            </div>
          </section>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed top-0 left-0 w-full bg-white z-40 overflow-hidden transition-[height] duration-500 ease-in-out ${
            open ? 'h-screen' : 'h-0'
          }`}>
          <div className='flex flex-col px-6 pt-28 h-full'>
            <ul className='flex flex-col w-full space-y-2'>
              {navLinks.map((link) => (
                <li
                  key={link.id}
                  className='w-full border-b border-gray-100'>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className='block py-4 text-2xl font-bold text-[#262626] hover:text-violet transition-colors'>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>

            <div
              className='mt-8 w-full'
              onClick={() => setOpen(false)}>
              <button
                onClick={() => router.push('/signup')}
                className='bg-[#262626] text-[#f5f6f7] w-full rounded-full py-4 text-lg font-medium hover:bg-opacity-90 transition-opacity shadow-xl'>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - UPDATED FOR MOBILE */}
      <header
        className={`max-w-6xl mx-auto px-4 md:px-6 pt-28 md:pt-36 pb-12 md:pb-20 ${outfit.className} antialiased overflow-hidden`}>
        <section>
          {/* Headline: Responsive Text Sizes */}
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#262626] text-balance text-center leading-tight md:leading-snug tracking-tight'>
            <span className={`${kalam.className} text-violet antialiased`}>
              Supercharge
            </span>{' '}
            Your Day With Your AI Personal Assistant
          </h2>

          {/* Subheadline: Responsive Text & Width */}
          <p className='mt-6 text-base md:text-lg text-center text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Your Google Calendar, optimized by AI for zero conflicts. Stop
            negotiating times and start doing deep work.
          </p>

          {/* CTA Button */}
          <div className='grid place-items-center w-full mt-8 md:mt-10'>
            <button
              className='bg-[#262626] text-[#f5f6f7] rounded-full py-4 px-8 md:px-10 text-lg font-medium hover:bg-black hover:scale-105 transition-all duration-300 shadow-xl'
              onClick={() => router.push('/signup')}>
              Get Started Now{' '}
              <span className='text-gray-400 font-normal text-sm ml-1 hidden sm:inline'>
                - it's free
              </span>
            </button>
          </div>

          {/* Hero Image: Responsive Width & Shadow */}
          <div className='w-full max-w-5xl mx-auto mt-12 md:mt-16 relative group'>
            {/* Optional Glow Effect behind image */}
            <div className='absolute -inset-1 bg-gradient-to-r from-violet to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000'></div>

            <Image
              src={hero}
              alt='Velox App Interface'
              className='relative rounded-xl md:rounded-2xl shadow-2xl border border-gray-200 w-full h-auto'
              placeholder='blur' // Good practice if using static import
              priority
            />
          </div>
        </section>
      </header>

      {/* Other Sections (Already Responsive) */}
      <Features />
      <Mission />
      <About />
      <FAQ />
      <Pricing />
      <Footer />
    </main>
  );
};

export default Home;
