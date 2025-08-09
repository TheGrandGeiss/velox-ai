'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  userPreferenceSchema,
  userPreferenceType,
} from '@/lib/zodSchema/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Onboarding = () => {
  const [step, setStep] = useState(1);

  function onNext() {
    setStep((prev) => prev + 1);
  }
  function onBack() {
    setStep((prev) => prev - 1);
  }

  const form = useForm<userPreferenceType>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      username: '',
      dob: new Date(),
      mainGoal: '',
      maxSessionLength: '15',
      weekendPreference: '',
      wakeUpTime: '',
      sleepTime: '',
    },
  });

  const renderText = () => {
    switch (step) {
      case 1:
        return 'Welcome To Steady | Your AI Scheduler';
      case 2:
        return 'Lets Know More About you';
      case 3:
        return "What's your day like?";
    }
  };

  function onSubmit() {}

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='  w-full max-w-4xl px-16  mx-auto space-y-8 pb-16 border-t-4 border-[#720455] rounded-t-sm rounded-tl-sm shadow-none'
          style={{
            boxShadow:
              '8px 0 10px -6px rgba(0, 0, 0, 0.1), -8px 0 10px -6px rgba(0, 0, 0, 0.1)',
          }}>
          <h2 className='pt-[3rem] text-3xl text-[#720455] font-bold text-center'>
            {renderText()}
          </h2>
          {step === 1 && (
            <div className='text-balance text-lg text-center tracking-wider pb-8'>
              👋 Welcome to Steady, your AI-powered productivity planner. Let’s
              finish a quick setup so your AI buddy can help you plan smarter,
              focus deeper, and get more done.
            </div>
          )}

          {step === 2 && (
            <div className='w-full space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='enter your username'
                        className='w-full h-14 focus-visible:ring-[#720455] focus-visible:ring-[1px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* date of birth */}
              <FormField
                control={form.control}
                name='dob'
                render={({ field }) => (
                  <FormItem className='flex flex-col '>
                    <FormLabel className='text-lg text-gray-500'>
                      Date of birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal h-14 ',
                              !field.value && 'text-muted-foreground'
                            )}>
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0'
                        align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          captionLayout='dropdown'
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* goal */}
              <FormField
                control={form.control}
                name='mainGoal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      What do you hope to achieve
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='enter your goals here'
                        {...field}
                        className='h-34 focus-visible:ring-[#720455] focus-visible:ring-[1px]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className='w-full space-y-8'>
              <FormField
                control={form.control}
                name='wakeUpTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      Average Wake Up Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='6:30 am'
                        className='w-full h-14 focus-visible:ring-[#720455] focus-visible:ring-[1px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* sleep time */}
              <FormField
                control={form.control}
                name='sleepTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      What Time Do You Go To Sleep
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='11:30 pm'
                        className='w-full h-14 focus-visible:ring-[#720455] focus-visible:ring-[1px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* weekend option */}
              <FormField
                control={form.control}
                name='weekendPreference'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      How Would You Rather Spend Your Weekends
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='py-7 w-full'>
                          <SelectValue placeholder='Select a weekend schedule' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=''>
                        <SelectItem value='FULL'>Full Day Schedules</SelectItem>
                        <SelectItem value='LIGHT'>
                          Light Day Schedules
                        </SelectItem>
                        <SelectItem value='NONE'>No schedules</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us understand your preferred balance between
                      productivity and rest
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='maxSessionLength'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-lg text-gray-500'>
                      How Long Would You Want Your Sessions To be
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='py-7 w-full'>
                          <SelectValue placeholder='How Long Can You Focus' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=''>
                        <SelectItem value='15'>15 mins</SelectItem>
                        <SelectItem value='30'>30 mins</SelectItem>
                        <SelectItem value='45'>45 mins</SelectItem>
                        <SelectItem value='60'>1 hr</SelectItem>
                        <SelectItem value='90'>1 hr 30 mins</SelectItem>
                        <SelectItem value='120'>2 hrs</SelectItem>
                        <SelectItem value='150'>2 hrs 30 mins</SelectItem>
                        <SelectItem value='180'>3 hrs</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how long your typical deep work or study session
                      lasts. This helps us structure your daily focus blocks
                      accordingly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* buttons */}

          <div className='flex justify-between items-center'>
            <Button
              onClick={onBack}
              disabled={step === 1}
              className='bg-gray-600 text-xl py-6 px-10'>
              Previous
            </Button>
            {step === 3 ? (
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='bg-green-600 text-xl py-6 px-10'>
                Submit
              </Button>
            ) : (
              <Button
                onClick={onNext}
                className='bg-[#720455] text-xl py-6 px-10'>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Onboarding;
