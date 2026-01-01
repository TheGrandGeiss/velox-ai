import { Outfit } from 'next/font/google';
import { FaShieldAlt, FaMagic, FaBrain } from 'react-icons/fa';

const outfit = Outfit({ subsets: ['latin'] });

const features = [
  {
    icon: <FaShieldAlt size={24} />,
    title: 'Intelligent Conflict Guard',
    description:
      'Say goodbye to awkward rescheduling. Velox detects double-bookings instantly and suggests the best alternative slots.',
  },
  {
    icon: <FaMagic size={24} />,
    title: 'Natural Language Command',
    description:
      "Just type 'Lunch with team next Friday' and let AI handle the details. No more clicking through endless date pickers.",
  },
  {
    icon: <FaBrain size={24} />,
    title: 'Focus Flow Protection',
    description:
      "Velox analyzes your peak productivity hours and automatically blocks out 'Deep Work' sessions to keep your momentum going.",
  },
];

const Features = () => {
  return (
    <section
      id='features'
      // CHANGED: py-24 -> py-16 lg:py-24 (Reduced vertical padding on phones/tablets)
      className={`py-16 lg:py-24 bg-[#f5f6f7] ${outfit.className}`}>
      <div className='max-w-6xl mx-auto px-6'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          {/* The "Pill" Style */}
          <div className='inline-block px-5 py-1.5 mb-6 border border-gray-200 rounded-full bg-gray-50'>
            <h3 className='text-violet font-medium tracking-wide text-sm'>
              Features
            </h3>
          </div>

          {/* CHANGED: md:text-5xl -> lg:text-5xl (Keeps font smaller on tablets) */}
          <h2 className='text-4xl lg:text-5xl font-bold text-[#262626]'>
            More than just a calendar.
          </h2>
        </div>

        {/* Feature Grid */}
        {/* CHANGED: md:grid-cols-3 -> lg:grid-cols-3 (Tablets now stack in 1 column) */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='p-8 rounded-2xl bg-[#f5f6f7] border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300 group'>
              {/* Icon Bubble */}
              <div className='w-14 h-14 bg-white rounded-xl flex items-center justify-center text-violet shadow-sm mb-6 group-hover:scale-110 transition-transform'>
                {feature.icon}
              </div>

              <h3 className='text-xl font-bold text-[#262626] mb-3'>
                {feature.title}
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
