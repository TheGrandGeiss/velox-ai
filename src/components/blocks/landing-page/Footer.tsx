import { Shrikhand, Outfit } from 'next/font/google';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const shrikhand = Shrikhand({ weight: ['400'], subsets: ['latin'] });
const outfit = Outfit({ subsets: ['latin'] });

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-[#262626] text-white pt-20 pb-10 ${outfit.className}`}>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12'>
          {/* Column 1: Brand & Tagline */}
          <div className='col-span-1 md:col-span-1'>
            <h2 className={`${shrikhand.className} text-3xl mb-4`}>Velox</h2>
            <p className='text-gray-400 leading-relaxed text-sm'>
              Your AI Personal Assistant. Sync Google Calendar, automate your
              schedule, and reclaim your time.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className='font-bold text-lg mb-4'>Product</h3>
            <ul className='space-y-3 text-gray-400 text-sm'>
              <li>
                <Link
                  href='#features'
                  className='hover:text-white transition-colors'>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#pricing'
                  className='hover:text-white transition-colors'>
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='#faq'
                  className='hover:text-white transition-colors'>
                  FAQ
                </Link>
              </li>
              <li>
                <span className='text-violet text-xs font-bold uppercase tracking-wider ml-1'>
                  New
                </span>{' '}
                Roadmap
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (Crucial for Google Verification) */}
          <div>
            <h3 className='font-bold text-lg mb-4'>Legal</h3>
            <ul className='space-y-3 text-gray-400 text-sm'>
              {/* These pages are mandatory for Google verification */}
              <li>
                <Link
                  href='/privacy'
                  className='hover:text-white transition-colors'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='hover:text-white transition-colors'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/data-usage'
                  className='hover:text-white transition-colors'>
                  Google Data Usage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className='font-bold text-lg mb-4'>Connect</h3>
            <div className='flex gap-4'>
              <Link
                href='https://x.com/ChideraEbenebe'
                target='_blank'
                aria-label='Twitter / X'
                className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet transition-colors duration-300'>
                <FaTwitter size={18} />
              </Link>
              <Link
                href='https://github.com/ChideraEbenebe'
                target='_blank'
                aria-label='Github'
                className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet transition-colors duration-300'>
                <FaGithub size={18} />
              </Link>
              <Link
                target='_blank'
                aria-label='linkedIn'
                href='https://www.linkedin.com/in/chidera-ebenebe-a4b94b256/'
                className='w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-violet transition-colors duration-300'>
                <FaLinkedin size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500'>
          <p>&copy; {currentYear} Velox. All rights reserved.</p>

          <div className='mt-4 md:mt-0 flex items-center gap-2'>
            <span>Built with ❤️ in Nigeria by</span>
            <a
              href='#about'
              className='text-white hover:text-violet transition-colors font-medium'>
              Emmanuel Chidera
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
