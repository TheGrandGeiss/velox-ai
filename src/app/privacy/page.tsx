'use client';

import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function Privacy() {
  return (
    <main className={`min-h-screen bg-[#f5f6f7] py-24 ${outfit.className}`}>
      <div className='max-w-3xl mx-auto px-6 bg-white p-12 rounded-2xl shadow-sm border border-gray-100'>
        <h1 className='text-3xl font-bold text-[#262626] mb-2'>
          Privacy Policy
        </h1>
        <p className='text-sm text-gray-400 mb-8'>
          Last Updated: January 1, 2026
        </p>

        <div className='space-y-6 text-gray-600 leading-relaxed'>
          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              1. Introduction
            </h2>
            <p>
              Velox ("we", "our", or "us") is committed to protecting your
              privacy. This policy explains how we collect, use, and safeguard
              your information when you use our scheduling assistant.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              2. Information We Collect
            </h2>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <strong>Account Information:</strong> Name, email address, and
                profile picture (via Google Sign-In).
              </li>
              <li>
                <strong>Calendar Data:</strong> Event titles, times, and
                descriptions (only accessed to provide scheduling services).
              </li>
              <li>
                <strong>Usage Data:</strong> Logs and metrics on how you use our
                features to help us improve the app.
              </li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              3. How We Use Your Data
            </h2>
            <p>We use your information to:</p>
            <ul className='list-disc pl-5 space-y-1 mt-2'>
              <li>Authenticate your account.</li>
              <li>Detect scheduling conflicts and suggest meeting times.</li>
              <li>Send you important updates regarding your account.</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              4. Data Security
            </h2>
            <p>
              We implement industry-standard security measures (encryption in
              transit and at rest) to protect your data. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className='text-xl font-semibold text-[#262626] mb-3'>
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at [Your Support Email].
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
