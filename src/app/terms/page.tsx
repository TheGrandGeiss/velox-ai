'use client';

import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function Terms() {
  return (
    <main className={`min-h-screen bg-[#f5f6f7] py-24 ${outfit.className}`}>
      <div className='max-w-3xl mx-auto px-6 bg-white p-12 rounded-2xl shadow-sm border border-gray-100'>
        <h1 className='text-3xl font-bold text-[#262626] mb-2'>
          Terms of Service
        </h1>
        <p className='text-sm text-gray-400 mb-8'>
          Last Updated: January 1, 2026
        </p>

        <div className='space-y-6 text-gray-600 leading-relaxed'>
          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Velox, you agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use
              our services.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              2. Description of Service
            </h2>
            <p>
              Velox is an AI-powered scheduling assistant. We provide tools to
              help manage your Google Calendar. You understand that the AI may
              occasionally make errors, and you are responsible for verifying
              your schedule.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              3. User Conduct
            </h2>
            <p>
              You agree not to use Velox for any unlawful purpose or to solicit
              others to perform or participate in any unlawful acts. You must
              not attempt to reverse engineer or scrape our platform.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              4. Limitation of Liability
            </h2>
            <p className='uppercase text-sm font-bold text-gray-500'>
              Read this carefully:
            </p>
            <p>
              Velox is provided "as is." We are not liable for any missed
              meetings, lost data, or damages resulting from the use of our
              service. You use the application at your own risk.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
