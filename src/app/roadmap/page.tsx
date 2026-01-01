'use client';

import { Outfit } from 'next/font/google';
import { FaCheckCircle, FaHammer, FaLightbulb } from 'react-icons/fa';

const outfit = Outfit({ subsets: ['latin'] });

// Status configurations for easy styling
const statusConfig = {
  live: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: <FaCheckCircle />,
    label: 'Live Now',
  },
  building: {
    color: 'text-violet',
    bg: 'bg-violet/10',
    icon: <FaHammer />,
    label: 'In Progress',
  },
  planned: {
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    icon: <FaLightbulb />,
    label: 'Up Next',
  },
};

const items = [
  {
    quarter: 'Q1 2026',
    title: 'The Foundation',
    description:
      'Launch of the core Velox beta. Focusing on seamless Google Calendar integration and conflict detection.',
    status: 'live',
    features: [
      'Google Sign-In & Sync',
      'Smart Conflict Detection',
      'Basic AI Scheduling',
    ],
  },
  {
    quarter: 'Q2 2026',
    title: 'Team Collaboration',
    description:
      'Moving beyond the individual. Enabling teams to view shared availability and book group sessions instantly.',
    status: 'building',
    features: [
      'Shared Team Availability',
      'Meeting Polls',
      'Recurring Event Optimization',
    ],
  },
  {
    quarter: 'Q3 2026',
    title: 'The Ecosystem',
    description:
      'Breaking out of the Google walled garden. Adding support for other calendar providers and deeper integrations.',
    status: 'planned',
    features: [
      'Outlook & Apple Calendar Sync',
      'Zoom & Teams Links',
      'Mobile App (iOS Beta)',
    ],
  },
  {
    quarter: 'Q4 2026',
    title: 'Advanced Intelligence',
    description:
      'Leveraging user data to proactively manage your energy levels and focus time, not just your slots.',
    status: 'planned',
    features: [
      'Focus Flow Protection (Auto-blocking)',
      'Productivity Analytics Dashboard',
      'Voice Commands',
    ],
  },
];

export default function Roadmap() {
  return (
    <main className={`min-h-screen bg-[#f5f6f7] py-24 ${outfit.className}`}>
      <div className='max-w-4xl mx-auto px-6'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-block px-5 py-1.5 mb-6 border border-gray-200 rounded-full bg-white shadow-sm'>
            <h3 className='text-violet font-medium tracking-wide text-sm'>
              Public Roadmap
            </h3>
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-[#262626] mb-4'>
            Building the future of time.
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Transparency is key. Here is exactly what we are working on to make
            Velox better every single day.
          </p>
        </div>

        {/* Timeline Container */}
        <div className='relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent'>
          {items.map((item, index) => {
            const config =
              statusConfig[item.status as keyof typeof statusConfig];

            return (
              <div
                key={index}
                className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'>
                {/* Icon Marker on the Line */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#f5f6f7] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${config.bg} ${config.color}`}>
                  {config.icon}
                </div>

                {/* Content Card */}
                <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300'>
                  {/* Status Badge */}
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-sm font-bold text-gray-400 uppercase tracking-wider'>
                      {item.quarter}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <h3 className='text-xl font-bold text-[#262626] mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-gray-600 mb-6 leading-relaxed'>
                    {item.description}
                  </p>

                  {/* Feature List */}
                  <ul className='space-y-2'>
                    {item.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className='flex items-center text-sm text-gray-500'>
                        <div className='w-1.5 h-1.5 rounded-full bg-gray-300 mr-3'></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action - Suggestion Box */}
        <div className='mt-24 text-center'>
          <div className='bg-[#262626] rounded-2xl p-10 md:p-12 text-white shadow-2xl relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-violet opacity-20 blur-3xl rounded-full -mr-20 -mt-20'></div>

            <div className='relative z-10'>
              <h2 className='text-3xl font-bold mb-4'>
                Have a brilliant idea?
              </h2>
              <p className='text-gray-400 mb-8 max-w-lg mx-auto'>
                Velox is built for you. If there is a feature that would save
                you hours every week, let me know.
              </p>
              <a
                href='mailto:support@velox.com'
                className='inline-block bg-white text-[#262626] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors'>
                Suggest a Feature
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
