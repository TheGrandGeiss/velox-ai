'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { FaGoogle, FaArrowRight } from 'react-icons/fa';

// Shadcn UI Imports
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { logInuser } from '@/lib/actions/signInAction';

const outfit = Outfit({ subsets: ['latin'] });

// Simple Schema for Login
const SignInSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  // Add password here if you use credentials: password: z.string().min(6),
});

type SignInInput = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: SignInInput) {
    await logInuser(values.email);
  }

  return (
    <div className={`min-h-screen flex ${outfit.className}`}>
      {/* LEFT SIDE: Visual (Hidden on Mobile) */}
      <div className='hidden lg:flex w-1/2 bg-[#262626] relative overflow-hidden flex-col justify-between p-12 text-white'>
        {/* Background Gradients (Slightly different position to distinguish from Signup) */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
          <div className='absolute top-[20%] right-[-10%] w-96 h-96 bg-violet rounded-full opacity-20 blur-[100px]'></div>
          <div className='absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-[100px]'></div>
        </div>

        {/* Brand */}
        <div className='relative z-10'>
          <Link
            href='/'
            className='text-2xl font-bold tracking-tight hover:opacity-80 transition'>
            Velox.
          </Link>
        </div>

        {/* Welcome Text */}
        <div className='relative z-10 max-w-lg mb-20'>
          <h2 className='text-4xl font-medium leading-tight mb-4'>
            Welcome back.
          </h2>
          <p className='text-xl text-gray-400 font-light'>
            Your calendar has been waiting for you. Let's get you back in flow.
          </p>
        </div>

        {/* Footer/Copyright */}
        <div className='relative z-10 text-sm text-gray-500'>
          &copy; 2026 Velox Inc.
        </div>
      </div>

      {/* RIGHT SIDE: The Login Form */}
      <div className='w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile Brand */}
          <div className='lg:hidden text-center mb-8'>
            <Link
              href='/'
              className='text-2xl font-bold text-[#262626]'>
              Velox.
            </Link>
          </div>

          <div className='text-center lg:text-left'>
            <h1 className='text-3xl font-bold text-[#262626] mb-2'>Log in</h1>
            <p className='text-gray-500'>
              Enter your email to access your account.
            </p>
          </div>

          <div className='space-y-6'>
            {/* 1. Google Button */}
            <Button
              variant='outline'
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className='w-full h-14 text-base font-semibold border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-3 text-[#262626]'>
              <FaGoogle className='text-xl' />
              Log in with Google
            </Button>

            {/* Divider */}
            <div className='relative flex items-center'>
              <div className='flex-grow border-t border-gray-200'></div>
              <span className='flex-shrink-0 mx-4 text-gray-400 text-sm'>
                Or with email
              </span>
              <div className='flex-grow border-t border-gray-200'></div>
            </div>

            {/* 2. Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'>
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-gray-700 font-medium'>
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='name@example.com'
                          className='h-12 text-base px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-violet transition-all'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full h-12 bg-[#262626] hover:bg-black text-white font-semibold text-base transition-all flex items-center justify-center gap-2'>
                  Continue <FaArrowRight className='text-sm' />
                </Button>
              </form>
            </Form>
          </div>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Don't have an account?{' '}
            <Link
              href='/signup'
              className='font-semibold text-violet hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
