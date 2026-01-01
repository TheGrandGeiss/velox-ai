import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function DataUsage() {
  return (
    <main className={`min-h-screen bg-[#f5f6f7] py-24 ${outfit.className}`}>
      <div className='max-w-3xl mx-auto px-6 bg-white p-12 rounded-2xl shadow-sm border border-gray-100'>
        <h1 className='text-3xl font-bold text-[#262626] mb-8'>
          Google User Data Policy
        </h1>

        <div className='space-y-6 text-gray-600 leading-relaxed'>
          <p>
            Velox requests access to your Google Calendar data to provide our
            core scheduling features. We are transparent about how we handle
            this sensitive data.
          </p>

          <h3 className='text-xl font-semibold text-[#262626] mt-6'>
            Limited Use Disclosure
          </h3>
          <p className='p-4 bg-gray-50 border-l-4 border-violet rounded-r-md'>
            Velox's use and transfer to any other app of information received
            from Google APIs will adhere to
            <a
              href='https://developers.google.com/terms/api-services-user-data-policy'
              target='_blank'
              className='text-violet underline mx-1'>
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>

          <h3 className='text-xl font-semibold text-[#262626] mt-6'>
            Data Usage
          </h3>
          <ul className='list-disc pl-5 space-y-2'>
            <li>
              <strong>Calendar Access:</strong> We read your calendar events to
              detect conflicts and identify free slots. We create events only
              when you explicitly instruct the AI to do so.
            </li>
            <li>
              <strong>AI Processing:</strong> Your schedule data is processed by
              our AI models solely to generate scheduling suggestions. This data
              is not used to train third-party AI models outside of this
              specific context.
            </li>
          </ul>

          <h3 className='text-xl font-semibold text-[#262626] mt-6'>
            Data Sharing
          </h3>
          <p>
            We do not sell, trade, or transfer your Google User Data to third
            parties for advertising purposes. Data is only transferred to
            service providers (like our cloud hosting or AI processing partners)
            strictly for the purpose of operating the Velox application.
          </p>
        </div>
      </div>
    </main>
  );
}
