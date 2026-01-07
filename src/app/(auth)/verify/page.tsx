import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'; // Make sure you have lucide-react installed

export default function page() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 to-gray-50 px-4'>
      <div className='max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100'>
        {/* Header Section with Icon */}
        <div className='p-8 pb-0 text-center'>
          <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6'>
            <Mail className='h-8 w-8 text-blue-600' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>
            Check your email
          </h2>
          <p className='mt-3 text-base text-gray-500'>
            We've sent a magic link to your inbox. Please click the link to
            confirm your address.
          </p>
        </div>

        {/* Main Content */}
        <div className='p-8 space-y-6'>
          {/* Status Box */}
          <div className='bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3'>
            <CheckCircle className='h-5 w-5 text-green-600 mt-0.5 shrink-0' />
            <div className='text-sm'>
              <h3 className='font-medium text-green-900'>
                Email sent successfully
              </h3>
              <p className='text-green-700 mt-1 leading-relaxed'>
                The link will expire in 24 hours. If you don't see it, check
                your spam folder.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-200' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Didn't receive it?
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className='text-center space-y-4'>
            <Link
              href='/api/auth/signin' // Or wherever your login triggers from
              className='text-indigo-600 hover:text-indigo-500 font-medium text-sm transition-colors hover:underline'>
              Click to resend email
            </Link>

            <div className='pt-2'>
              <Link
                href='/login'
                className='inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
