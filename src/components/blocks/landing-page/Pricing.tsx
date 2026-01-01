import { Outfit } from 'next/font/google';
import { FaCheck } from 'react-icons/fa';

const outfit = Outfit({ subsets: ['latin'] });

const Pricing = () => {
  return (
    <section
      id='pricing'
      className={`py-24 bg-[#f5f6f7] ${outfit.className}`}>
      <div className='max-w-6xl mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <div className='inline-block px-5 py-1.5 mb-6 border border-gray-200 rounded-full bg-gray-50'>
            <h3 className='text-violet font-medium tracking-wide text-sm'>
              Pricing
            </h3>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold text-[#262626] mb-4'>
            Simple pricing. <span className='text-violet'>Currently $0.</span>
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            We are in active development. Use Velox completely free while we
            build the best AI scheduling experience on the market.
          </p>
        </div>

        {/* The Pricing Card - Centered Single Card */}
        <div className='max-w-md mx-auto relative group'>
          {/* Decorative Blur Background */}
          <div className='absolute -inset-1 bg-gradient-to-r from-violet-200 to-pink-200 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>

          <div className='relative bg-white border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300'>
            {/* Badge */}
            <div className='flex justify-between items-start mb-6'>
              <div>
                <h3 className='text-2xl font-bold text-[#262626]'>
                  Early Adopter
                </h3>
                <p className='text-gray-500 mt-1'>
                  Full access to all features
                </p>
              </div>
              <span className='bg-violet/10 text-violet text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider'>
                Beta
              </span>
            </div>

            {/* Price */}
            <div className='mb-8'>
              <span className='text-5xl font-bold text-[#262626]'>$0</span>
              <span className='text-gray-500 text-lg'>/month</span>
            </div>

            {/* Features List */}
            <ul className='space-y-4 mb-8'>
              {[
                'Unlimited Scheduling',
                'Google Calendar Sync',
                'AI Conflict Guard',
                'Natural Language Commands',
                'Priority Support via Email',
              ].map((item, i) => (
                <li
                  key={i}
                  className='flex items-center text-gray-700'>
                  <div className='bg-green-100 p-1 rounded-full mr-3'>
                    <FaCheck
                      size={12}
                      className='text-green-600'
                    />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button className='w-full bg-[#262626] text-[#f5f6f7] rounded-xl py-4 font-medium hover:bg-opacity-90 transition-all shadow-lg'>
              Start Using Velox
            </button>

            {/* The SaaS Disclaimer */}
            <p className='text-xs text-center text-gray-400 mt-6 leading-relaxed'>
              * Velox will transition to a paid SaaS model as we introduce
              advanced team features. Join now to lock in your early supporter
              status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
