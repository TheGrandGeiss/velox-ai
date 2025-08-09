import React from 'react';

export default function VerifyEmailPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Check your email
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            We've sent you a magic link to sign in to your account.
          </p>
        </div>

        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <div className='flex'>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                Magic link sent!
              </h3>
              <div className='mt-2 text-sm text-blue-700'>
                <p>
                  Click the link in your email to complete the sign-in process.
                  The link will expire in 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Didn't receive the email? Check your spam folder or{' '}
            <a
              href='/sign-up'
              className='text-indigo-600 hover:text-indigo-500'>
              try again
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
