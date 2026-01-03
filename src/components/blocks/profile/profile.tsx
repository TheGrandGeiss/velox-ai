'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Save, Mail, Camera } from 'lucide-react';
import { WeekendPreference } from '@prisma/client';
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
import { Textarea } from '@/components/ui/textarea';
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
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn, getInitials } from '@/lib/utils';
import {
  userPreferenceSchema,
  userPreferenceType,
  sessionLength,
} from '@/lib/zodSchema/onboarding';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/actions/profileAction';

export default function ProfilePage({
  initialData,
}: {
  initialData: {
    dob: string;
    createdAt: string;
    updatedAt: string;
    username: string;
    mainGoal: string;
    maxSessionLength: string;
    weekendPreference: WeekendPreference;
    wakeUpTime: string;
    sleepTime: string;
    image: string | null;
    id: string;
    userId: string;
  } | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const form = useForm<userPreferenceType>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      username: initialData?.username,
      mainGoal: initialData?.mainGoal,
      maxSessionLength: initialData?.maxSessionLength,
      weekendPreference: initialData?.weekendPreference,
      wakeUpTime: initialData?.wakeUpTime,
      sleepTime: initialData?.sleepTime,
      dob: initialData?.dob ? new Date(initialData?.dob) : undefined,
    },
    mode: 'onChange',
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: userPreferenceType) {
    setIsLoading(true);
    try {
      const updated = await updateProfile(data);

      if (!updated.success) {
        toast.error('failed to update user details');
        return;
      }

      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('failed to update user details');
    } finally {
      setIsLoading(false);
    }
  }

  const initials = getInitials(initialData?.username);

  return (
    <div className='min-h-screen bg-[#0d0e12] text-white p-6 md:p-10 font-sans'>
      <div className='max-w-5xl mx-auto space-y-8'>
        {/* HEADER */}
        <div className='flex flex-col md:flex-row gap-6 items-start md:items-center justify-between'>
          <div className='flex items-center gap-5'>
            <div className='relative group'>
              <Avatar className='h-24 w-24 border-2 border-[#b591ef]/20 transition-opacity group-hover:opacity-75'>
                <AvatarImage
                  src={imagePreview || 'https://github.com/shadcn.png'}
                  alt='Profile'
                  className='object-cover'
                />
                <AvatarFallback className='bg-[#1c1c21] text-[#b591ef] text-xl'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div
                className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all'
                onClick={() => fileInputRef.current?.click()}>
                <Camera className='w-8 h-8 text-white drop-shadow-md' />
              </div>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handleImageChange}
              />
            </div>

            <div className='space-y-1'>
              <h1 className='text-3xl font-bold tracking-tight text-white'>
                {initialData?.username}
              </h1>
              <div className='flex items-center gap-2 text-gray-400'>
                <Mail className='w-4 h-4' />
                <span>{session?.user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className='bg-white/10' />

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-3 space-y-1 hidden lg:block'>
            <h3 className='text-lg font-semibold mb-4 text-white'>Settings</h3>
            <Button
              variant='ghost'
              className='w-full justify-start bg-[#b591ef]/10 text-[#b591ef] font-medium'>
              General
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start text-gray-400 hover:text-white hover:bg-white/5'>
              Account
            </Button>
          </div>

          {/* Form */}
          <div className='lg:col-span-9'>
            <Card className='bg-[#1c1c21] border-white/10 shadow-xl'>
              <CardHeader>
                <CardTitle className='text-2xl text-white'>
                  User Preferences
                </CardTitle>
                <CardDescription className='text-gray-400'>
                  Customize how the AI scheduler organizes your day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'>
                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-gray-300'>
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='shadcn'
                              {...field}
                              className='bg-[#0d0e12] border-white/10 text-white focus-visible:ring-[#b591ef]'
                            />
                          </FormControl>
                          <FormMessage className='text-red-400' />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        control={form.control}
                        name='dob'
                        render={({ field }) => (
                          <FormItem className='flex flex-col'>
                            <FormLabel className='text-gray-300'>
                              Date of birth
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full pl-3 text-left font-normal bg-[#0d0e12] border-white/10 text-white hover:bg-[#0d0e12] hover:text-white hover:border-[#b591ef]',
                                      !field.value && 'text-muted-foreground'
                                    )}>
                                    {field.value ? (
                                      format(new Date(field.value), 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0 bg-[#1c1c21] border-white/10 text-white'
                                align='start'>
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                  className='bg-[#1c1c21] text-white'
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className='text-red-400' />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='weekendPreference'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-gray-300'>
                              Weekend Preference
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='bg-[#0d0e12] border-white/10 text-white focus:ring-[#b591ef]'>
                                  <SelectValue placeholder='Select preference' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='bg-[#1c1c21] border-white/10 text-white'>
                                {/* ✅ Dynamically map over Prisma Enum keys */}
                                {Object.keys(WeekendPreference).map((key) => (
                                  <SelectItem
                                    key={key}
                                    value={key}>
                                    {key.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-red-400' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                      <FormField
                        control={form.control}
                        name='wakeUpTime'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-gray-300'>
                              Wake Up Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='time'
                                {...field}
                                className='bg-[#0d0e12] border-white/10 text-white focus-visible:ring-[#b591ef] [color-scheme:dark]'
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
                            <FormLabel className='text-gray-300'>
                              Sleep Time
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='time'
                                {...field}
                                className='bg-[#0d0e12] border-white/10 text-white focus-visible:ring-[#b591ef] [color-scheme:dark]'
                              />
                            </FormControl>
                            <FormMessage className='text-red-400' />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='maxSessionLength'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-gray-300'>
                              Focus Duration (Mins)
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className='bg-[#0d0e12] border-white/10 text-white focus:ring-[#b591ef]'>
                                  <SelectValue placeholder='Select minutes' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className='bg-[#1c1c21] border-white/10 text-white h-60'>
                                {/* ✅ Using the imported array from your schema */}
                                {sessionLength.map((len) => (
                                  <SelectItem
                                    key={len}
                                    value={len}>
                                    {len} minutes
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className='text-red-400' />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name='mainGoal'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-gray-300'>
                            Main Goal
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='e.g. Learn React...'
                              className='resize-none bg-[#0d0e12] border-white/10 text-white focus-visible:ring-[#b591ef] min-h-[100px]'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='text-red-400' />
                        </FormItem>
                      )}
                    />

                    <div className='flex justify-end pt-4'>
                      <Button
                        type='submit'
                        disabled={isLoading}
                        className='bg-[#b591ef] hover:bg-[#9f7aea] text-[#1c1c21] font-bold px-8'>
                        {isLoading ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <Save className='mr-2 h-4 w-4' />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
