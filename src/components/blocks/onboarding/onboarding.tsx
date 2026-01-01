'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Outfit } from 'next/font/google';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

// Logic & Actions
import {
  userPreferenceSchema,
  userPreferenceType,
} from '@/lib/zodSchema/onboarding';
import { createProfile } from '@/lib/actions/profileAction';
import { redirect } from 'next/navigation';

const outfit = Outfit({ subsets: ['latin'] });

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<userPreferenceType>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      username: '',
      dob: new Date(),
      mainGoal: '',
      maxSessionLength: '30',
      weekendPreference: 'FULL',
      wakeUpTime: '',
      sleepTime: '',
    },
    shouldUnregister: false,
  });

  // Calculate progress percentage
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = true;
    } else if (step === 2) {
      isValid = await form.trigger(['username', 'dob', 'mainGoal']);
    }

    if (isValid) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: userPreferenceType) => {
    await createProfile(values);
    redirect('/dashboard');
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-[#f5f6f7] p-4 md:p-6 ${outfit.className}`}>
      <Card className='w-full max-w-2xl shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm'>
        {/* Progress Bar - Updated to Violet */}
        <div className='w-full bg-gray-100 h-1.5'>
          <div
            className='bg-violet-600 h-1.5 transition-all duration-500 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>

        <CardHeader className='pt-10 pb-2 text-center space-y-3'>
          <div className='inline-block mx-auto p-3 bg-violet-50 rounded-full mb-2'>
            {step === 1 && <Sparkles className='w-6 h-6 text-violet-600' />}
            {step === 2 && <span className='text-2xl'>👤</span>}
            {step === 3 && <span className='text-2xl'>⏰</span>}
          </div>

          <h2 className='text-2xl md:text-3xl font-bold text-[#262626] tracking-tight'>
            {step === 1 && 'Welcome to Steady'}
            {step === 2 && 'Tell us about yourself'}
            {step === 3 && 'Your Daily Rhythm'}
          </h2>
          <p className='text-gray-500 text-sm md:text-base max-w-md mx-auto'>
            {step === 1 && "Let's set up your AI productivity companion."}
            {step === 2 && 'This helps us personalize your experience.'}
            {step === 3 && 'Customize how Steady plans your day.'}
          </p>
        </CardHeader>

        <CardContent className='p-6 md:px-12 md:py-8'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'>
              {/* --- STEP 1: WELCOME --- */}
              <div className={cn('space-y-6', step !== 1 && 'hidden')}>
                <div className='text-center space-y-6'>
                  <p className='text-[#262626] leading-relaxed text-base md:text-lg'>
                    Steady helps you plan smarter, focus deeper, and get more
                    done. We just need a few details to tailor the AI to your
                    specific needs.
                  </p>
                  <div className='bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-500'>
                    🚀 Takes less than 60 seconds to complete.
                  </div>
                </div>
              </div>

              {/* --- STEP 2: PERSONAL INFO --- */}
              <div className={cn('space-y-5', step !== 2 && 'hidden')}>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#262626] font-medium'>
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Alex Creative'
                          className='h-12 bg-white focus-visible:ring-violet-500'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dob'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel className='text-[#262626] font-medium'>
                        Date of Birth
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal h-12 hover:bg-white focus:ring-violet-500',
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='mainGoal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#262626] font-medium'>
                        Main Goal
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='e.g. I want to launch my startup while working full-time.'
                          className='resize-none min-h-[120px] bg-white focus-visible:ring-violet-500'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- STEP 3: PREFERENCES --- */}
              <div className={cn('space-y-5', step !== 3 && 'hidden')}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='wakeUpTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#262626] font-medium'>
                          Wake Up Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='06:30 AM'
                            className='h-12 bg-white focus-visible:ring-violet-500'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='sleepTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#262626] font-medium'>
                          Bedtime
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='11:00 PM'
                            className='h-12 bg-white focus-visible:ring-violet-500'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='weekendPreference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#262626] font-medium'>
                        Weekend Preference
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='h-12 bg-white focus:ring-violet-500'>
                            <SelectValue placeholder='Select preference' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='FULL'>
                            Full Schedule (Productive)
                          </SelectItem>
                          <SelectItem value='LIGHT'>
                            Light Schedule (Balanced)
                          </SelectItem>
                          <SelectItem value='NONE'>
                            No Schedule (Rest)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='maxSessionLength'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#262626] font-medium'>
                        Focus Duration
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className='h-12 bg-white focus:ring-violet-500'>
                            <SelectValue placeholder='Select duration' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='15'>15 mins (Sprints)</SelectItem>
                          <SelectItem value='30'>30 mins (Pomodoro)</SelectItem>
                          <SelectItem value='45'>45 mins</SelectItem>
                          <SelectItem value='60'>1 hour (Deep Work)</SelectItem>
                          <SelectItem value='90'>90 mins</SelectItem>
                          <SelectItem value='120'>2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ideal length for a single session.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='bg-gray-50/50 p-6 md:px-12 flex justify-between items-center border-t border-gray-100'>
          <Button
            variant='ghost'
            onClick={handleBack}
            disabled={step === 1}
            className='text-gray-500 hover:text-[#262626] hover:bg-gray-100'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          {step === totalSteps ? (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className='bg-[#262626] hover:bg-violet-600 text-white px-8 h-12 rounded-lg shadow-md transition-all duration-300'>
              Finish Setup
              <Check className='w-4 h-4 ml-2' />
            </Button>
          ) : (
            <Button
              type='button'
              onClick={handleNext}
              className='bg-[#262626] hover:bg-violet-600 text-white px-8 h-12 rounded-lg shadow-md transition-all duration-300'>
              Next Step
              <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
