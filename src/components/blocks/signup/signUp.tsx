'use client';

import { SignUpInput, SignUpSchema } from '@/lib/zodSchema/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createUser } from '@/lib/actions/signUpAction';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Outfit } from 'next/font/google';
import { FaGoogle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

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
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'] });

const SignUp = () => {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      terms: false, // Ensure terms has a default
    },
  });

  async function onSubmit(values: SignUpInput) {
    const result = await createUser(values.email);
    if (!result) {
      toast.error('Failed to create user');
      return;
    }
    toast.success('User created successfully');
    redirect('/verify');
  }

  return (
    <div className={`min-h-screen flex ${outfit.className}`}>
      {/* LEFT SIDE: The Visual Experience (Hidden on Mobile) */}
      <div className='hidden lg:flex w-1/2 bg-[#262626] relative overflow-hidden flex-col justify-between p-12 text-white'>
        {/* Background Gradients */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0'>
          <div className='absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet rounded-full opacity-20 blur-[100px]'></div>
          <div className='absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-[100px]'></div>
        </div>

        {/* Brand */}
        <div className='relative z-10'>
          <Link
            href='/'
            className='text-2xl font-bold tracking-tight hover:opacity-80 transition'>
            Velox.
          </Link>
        </div>

        {/* Testimonial */}
        <div className='relative z-10 max-w-lg'>
          <div className='mb-8 flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className='text-yellow-400 text-xl'>
                ★
              </span>
            ))}
          </div>
          <h2 className='text-3xl font-medium leading-relaxed mb-6'>
            "I used to spend 2 hours a week just organizing my calendar. Velox
            gave me my Sunday evenings back."
          </h2>
          <div>
            <p className='font-bold text-lg'>Sarah J.</p>
            <p className='text-gray-400'>Product Designer @ TechFlow</p>
          </div>
        </div>

        {/* Mini Features */}
        <div className='relative z-10 flex gap-6 text-sm text-gray-400'>
          <div className='flex items-center gap-2'>
            <FaCheckCircle className='text-violet' /> Free Forever Tier
          </div>
          <div className='flex items-center gap-2'>
            <FaCheckCircle className='text-violet' /> No Credit Card Required
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: The Logic (Your Form) */}
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
            <h1 className='text-3xl font-bold text-[#262626] mb-2'>
              Create your account
            </h1>
            <p className='text-gray-500'>
              Start automating your schedule in seconds.
            </p>
          </div>

          <div className='space-y-6'>
            {/* 1. Google Button (Top Priority) */}
            <Button
              variant='outline'
              onClick={() => signIn('google')}
              className='w-full h-14 text-base font-semibold border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-3 text-[#262626]'>
              <FaGoogle className='text-xl' />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className='relative flex items-center'>
              <div className='flex-grow border-t border-gray-200'></div>
              <span className='flex-shrink-0 mx-4 text-gray-400 text-sm'>
                Or with email
              </span>
              <div className='flex-grow border-t border-gray-200'></div>
            </div>

            {/* 2. Your Zod Form */}
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

                {/* Terms Checkbox */}
                <FormField
                  control={form.control}
                  name='terms'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 p-1'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className='data-[state=checked]:bg-violet border-gray-300'
                        />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel className='text-sm font-normal text-gray-500'>
                          I agree to the{' '}
                          <Link
                            href='/terms'
                            className='underline hover:text-violet'>
                            Terms
                          </Link>{' '}
                          and{' '}
                          <Link
                            href='/privacy'
                            className='underline hover:text-violet'>
                            Privacy Policy
                          </Link>
                          .
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type='submit'
                  className='w-full h-12 bg-[#262626] hover:bg-black text-white font-semibold text-base transition-all flex items-center justify-center gap-2'>
                  Create Account <FaArrowRight className='text-sm' />
                </Button>
              </form>
            </Form>
          </div>

          <p className='text-center text-sm text-gray-500 mt-6'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-semibold text-violet hover:underline'>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
