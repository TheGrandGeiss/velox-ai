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
  User,
  Clock,
  Moon,
  Sun,
  Briefcase,
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
import {
  userPreferenceSchema,
  userPreferenceType,
} from '@/lib/zodSchema/onboarding'; // Verified import path
import { createProfile } from '@/lib/actions/profileAction';

const outfit = Outfit({ subsets: ['latin'] });

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // --- Date Picker Local State ---
  // We initialize these, but they will be controlled by the FormField below
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(new Date());
  const [inputValue, setInputValue] = React.useState('');

  const form = useForm<userPreferenceType>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      username: '',
      // dob: undefined, // Let Zod handle required validation
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

  // --- HELPERS ---
  const inputStyles =
    'bg-[#0d0e12] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#b591ef] focus-visible:border-[#b591ef] h-12 text-base';
  const labelStyles = 'text-gray-300 font-medium mb-2 block';
  const cardStyles = 'bg-[#1c1c21] border border-white/5 shadow-2xl';

  function formatDate(date: Date | undefined) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  function isValidDate(date: Date | undefined) {
    if (!date) return false;
    return !isNaN(date.getTime());
  }

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
    try {
      await createProfile(values);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Onboarding failed', error);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-[#0d0e12] p-4 md:p-6 ${outfit.className} text-white`}>
      {/* Background Ambient Glow */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#b591ef] opacity-[0.03] blur-[120px] rounded-full' />
        <div className='absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#b591ef] opacity-[0.05] blur-[120px] rounded-full' />
      </div>

      <Card
        className={`w-full max-w-2xl overflow-hidden relative z-10 ${cardStyles}`}>
        {/* Progress Bar */}
        <div className='w-full bg-white/5 h-1'>
          <div
            className='bg-[#b591ef] h-1 transition-all duration-500 ease-out shadow-[0_0_10px_#b591ef]'
            style={{ width: `${progress}%` }}
          />
        </div>

        <CardHeader className='pt-10 pb-2 text-center space-y-4'>
          <div className='inline-flex items-center justify-center w-16 h-16 mx-auto bg-[#b591ef]/10 rounded-2xl border border-[#b591ef]/20 mb-2'>
            {step === 1 && <Sparkles className='w-8 h-8 text-[#b591ef]' />}
            {step === 2 && <User className='w-8 h-8 text-[#b591ef]' />}
            {step === 3 && <Clock className='w-8 h-8 text-[#b591ef]' />}
          </div>

          <div className='space-y-2'>
            <h2 className='text-3xl md:text-4xl font-bold text-white tracking-tight'>
              {step === 1 && 'Welcome to Velox'}
              {step === 2 && 'Tell us about yourself'}
              {step === 3 && 'Your Daily Rhythm'}
            </h2>
            <p className='text-gray-400 text-base max-w-md mx-auto'>
              {step === 1 && "Let's set up your AI productivity companion."}
              {step === 2 && 'This helps us personalize your experience.'}
              {step === 3 && 'Customize how Velox plans your day.'}
            </p>
          </div>
        </CardHeader>

        <CardContent className='p-6 md:px-12 md:py-8'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'>
              {/* --- STEP 1: WELCOME --- */}
              <div className={cn('space-y-8 py-4', step !== 1 && 'hidden')}>
                <div className='text-center space-y-8'>
                  <p className='text-gray-300 leading-relaxed text-lg max-w-lg mx-auto'>
                    Velox helps you plan smarter, focus deeper, and get more
                    done. We just need a few details to tailor the AI to your
                    specific needs.
                  </p>
                  {/* Feature Pills */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2'>
                      <span className='text-2xl'>🧠</span>
                      <span className='text-sm font-medium text-gray-300'>
                        Smart Planning
                      </span>
                    </div>
                    <div className='p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2'>
                      <span className='text-2xl'>⚡</span>
                      <span className='text-sm font-medium text-gray-300'>
                        Deep Focus
                      </span>
                    </div>
                    <div className='p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-2'>
                      <span className='text-2xl'>📊</span>
                      <span className='text-sm font-medium text-gray-300'>
                        Analytics
                      </span>
                    </div>
                  </div>
                  <div className='bg-[#b591ef]/10 p-3 rounded-lg border border-[#b591ef]/20 text-sm text-[#b591ef] inline-block'>
                    🚀 Takes less than 60 seconds to complete.
                  </div>
                </div>
              </div>

              {/* --- STEP 2: PERSONAL INFO --- */}
              <div
                className={cn(
                  'space-y-6 animate-in fade-in slide-in-from-right-4 duration-300',
                  step !== 2 && 'hidden'
                )}>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyles}>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Alex Creative'
                          className={inputStyles}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                {/* ✅ HYBRID DATE PICKER (Text Input + Popover Calendar) */}
                <FormField
                  control={form.control}
                  name='dob'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel className={labelStyles}>
                        Date of Birth
                      </FormLabel>
                      <div className='relative flex items-center gap-2'>
                        {/* 1. Text Input */}
                        <FormControl>
                          <Input
                            {...field}
                            id='date'
                            type='text'
                            // Value logic: Use local state if typing, or formatted date if picked
                            value={
                              inputValue ||
                              (field.value ? formatDate(field.value) : '')
                            }
                            placeholder='June 01, 2000'
                            // Add padding-right to make room for the icon
                            className={cn(inputStyles, 'pr-10')}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              setInputValue(newValue); // Update text immediately

                              const parsedDate = new Date(newValue);
                              // Sync with RHF and Calendar if valid
                              if (
                                isValidDate(parsedDate) &&
                                newValue.length > 4
                              ) {
                                field.onChange(parsedDate);
                                setMonth(parsedDate);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setOpen(true);
                              }
                            }}
                          />
                        </FormControl>

                        {/* 2. Popover Trigger Button (Absolute Positioned) */}
                        <Popover
                          open={open}
                          onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant='ghost'
                              type='button'
                              className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-transparent'
                              onClick={() => setOpen(true)}>
                              <CalendarIcon className='h-4 w-4' />
                              <span className='sr-only'>Select date</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-auto p-0 bg-[#1c1c21] border-white/10 text-white'
                            align='end'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              month={month}
                              onMonthChange={setMonth}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  setInputValue(formatDate(date));
                                  setMonth(date);
                                  setOpen(false);
                                }
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              // Shadcn Dropdown Layout for Years
                              captionLayout='dropdown'
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              className='bg-[#1c1c21] text-white'
                              classNames={{
                                dropdown:
                                  'bg-[#1c1c21] text-white border border-white/10 p-1 rounded-md hover:bg-white/10 outline-none',
                                dropdown_month: 'mr-2',
                                dropdown_year: 'ml-2',
                                caption_label: 'hidden',
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='mainGoal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyles}>Main Goal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='e.g. I want to launch my startup while working full-time.'
                          className='bg-[#0d0e12] border-white/10 text-white resize-none min-h-[120px] focus-visible:ring-[#b591ef]'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- STEP 3: PREFERENCES --- */}
              <div
                className={cn(
                  'space-y-6 animate-in fade-in slide-in-from-right-4 duration-300',
                  step !== 3 && 'hidden'
                )}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='wakeUpTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>
                          <span className='flex items-center gap-2'>
                            <Sun className='w-4 h-4' /> Wake Up
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            className={`${inputStyles} [color-scheme:dark]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-red-400' />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='sleepTime'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>
                          <span className='flex items-center gap-2'>
                            <Moon className='w-4 h-4' /> Bedtime
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='time'
                            className={`${inputStyles} [color-scheme:dark]`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-red-400' />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='weekendPreference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyles}>
                        <span className='flex items-center gap-2'>
                          <Briefcase className='w-4 h-4' /> Weekend Preference
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder='Select preference' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-[#1c1c21] border-white/10 text-white'>
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
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='maxSessionLength'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyles}>
                        <span className='flex items-center gap-2'>
                          <Clock className='w-4 h-4' /> Focus Duration
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputStyles}>
                            <SelectValue placeholder='Select duration' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-[#1c1c21] border-white/10 text-white'>
                          <SelectItem value='15'>15 mins (Sprints)</SelectItem>
                          <SelectItem value='30'>30 mins (Pomodoro)</SelectItem>
                          <SelectItem value='45'>45 mins</SelectItem>
                          <SelectItem value='60'>1 hour (Deep Work)</SelectItem>
                          <SelectItem value='90'>90 mins</SelectItem>
                          <SelectItem value='120'>2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className='text-gray-500 text-xs'>
                        How long do you like to work before taking a break?
                      </FormDescription>
                      <FormMessage className='text-red-400' />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='bg-white/[0.02] p-6 md:px-12 flex justify-between items-center border-t border-white/5'>
          <Button
            variant='ghost'
            onClick={handleBack}
            disabled={step === 1}
            className='text-gray-400 hover:text-white hover:bg-white/5'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Back
          </Button>

          {step === totalSteps ? (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className='bg-[#b591ef] hover:bg-[#a37ee5] text-[#1a1423] px-8 h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(181,145,239,0.3)] transition-all duration-300'>
              Finish Setup
              <Check className='w-4 h-4 ml-2' />
            </Button>
          ) : (
            <Button
              type='button'
              onClick={handleNext}
              className='bg-[#b591ef] hover:bg-[#a37ee5] text-[#1a1423] px-8 h-12 rounded-xl font-bold shadow-[0_0_20px_rgba(181,145,239,0.3)] transition-all duration-300'>
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
