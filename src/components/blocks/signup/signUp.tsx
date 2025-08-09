'use client';

import { SignUpInput, SignUpSchema } from '@/lib/zodSchema/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import image from '@/assets/image2.svg';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
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
import { createUser } from '@/lib/actions/signUpAction';
import Image from 'next/image';
import { CiMail } from 'react-icons/ci';
import { signIn } from 'next-auth/react';

const SignUp = () => {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: SignUpInput) {
    await createUser(values.email);
  }

  return (
    <main className='flex justify-between items-center h-screen  max-w-[1450px] mx-auto'>
      <section className='w-full pr-10'>
        <Image
          src={image}
          alt='signup image'
        />
      </section>

      <section className='w-full'>
        <h2 className='text-4xl text-gray-600 font-bold pb-8 text-center'>
          Sign Up With Email
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-8 w-full'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-2xl font-semibold'>
                    Email
                  </FormLabel>
                  <FormControl className='h-20'>
                    <Input
                      className='border-gray-400 focus-visible:ring-base focus-visible:ring-[1px] placeholder:text-xl text-xl'
                      placeholder='example@gmail.com'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='terms'
              render={({ field }) => (
                <FormItem className='flex items-center space-x-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='data-[state=checked]:bg-base size-6'
                    />
                  </FormControl>
                  <FormLabel className='text-xl font-normal '>
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full text-white bg-base font-semibold py-8 text-xl flex gap-4'>
              <span>
                <CiMail size={36} />
              </span>{' '}
              <span>Continue with email</span>
            </Button>

            <div className='flex gap-4 items-center'>
              <div className='h-[1px] w-full bg-gray-300'></div>
              <span>OR</span>
              <div className='h-[1px] w-full bg-gray-300'></div>
            </div>

            <button
              onClick={() => {
                signIn('google');
              }}>
              {' '}
              <FcGoogle size={24} />
            </button>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default SignUp;
