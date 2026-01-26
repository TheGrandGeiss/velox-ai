'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Loader2,
  Save,
  Mail,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { FaGoogle, FaApple, FaMicrosoft } from 'react-icons/fa';
import { WeekendPreference } from '@prisma/client'; // Changed from generated/client for safety, revert if needed
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
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';
import {
  userPreferenceSchema,
  userPreferenceType,
  sessionLength,
} from '@/lib/zodSchema/onboarding';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/actions/profileAction';
import {
  connectGoogle,
  disconnectGoogle,
} from '@/lib/actions/connectionAction';
// 👇 IMPORT THE NEW COMPONENT
import DeleteAccountButton from './deleteaccountbutton';

// Helper to convert file to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface ProfilePageClientProps {
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
  isGoogleLinked: boolean;
}

export default function ProfilePageClient({
  initialData,
  isGoogleLinked,
}: ProfilePageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'account'>('general');
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const form = useForm<userPreferenceType>({
    resolver: zodResolver(userPreferenceSchema),
    defaultValues: {
      username: initialData?.username || '',
      mainGoal: initialData?.mainGoal || '',
      maxSessionLength: initialData?.maxSessionLength || '',
      weekendPreference: initialData?.weekendPreference || 'NONE',
      wakeUpTime: initialData?.wakeUpTime || '',
      sleepTime: initialData?.sleepTime || '',
      dob: initialData?.dob ? new Date(initialData?.dob) : undefined,
    },
    mode: 'onChange',
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleAction = async () => {
    setIsConnecting(true);
    try {
      if (isGoogleLinked) {
        await disconnectGoogle();
        toast.success('Disconnected Google account');
      } else {
        await connectGoogle();
        // Redirects handled by server action
      }
    } catch (error) {
      toast.error('Failed to update connection');
    } finally {
      setIsConnecting(false);
    }
  };

  async function onSubmit(data: userPreferenceType) {
    setIsLoading(true);
    try {
      let imageBase64 = initialData?.image;

      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile);
      }

      // Merge data for the server action
      const payload = {
        ...data,
        image: imageBase64,
      };

      const updated = await updateProfile(payload);

      if (!updated.success) {
        toast.error('Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const initials = getInitials(
    initialData?.username || session?.user?.name || 'User',
  );

  return (
    <div className='min-h-screen bg-[#0d0e12] text-white p-6 md:p-10 font-sans'>
      <div className='max-w-5xl mx-auto space-y-8'>
        {/* HEADER SECTION */}
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

              {/* Image Upload Overlay */}
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
                {initialData?.username || 'New User'}
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
          {/* SIDEBAR NAVIGATION */}
          <div className='lg:col-span-3 space-y-1 hidden lg:block'>
            <h3 className='text-lg font-semibold mb-4 text-white'>Settings</h3>
            <Button
              variant='ghost'
              onClick={() => setActiveTab('general')}
              className={cn(
                'w-full justify-start font-medium transition-colors',
                activeTab === 'general'
                  ? 'bg-[#b591ef]/10 text-[#b591ef]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
              )}>
              General
            </Button>
            <Button
              variant='ghost'
              onClick={() => setActiveTab('account')}
              className={cn(
                'w-full justify-start font-medium transition-colors',
                activeTab === 'account'
                  ? 'bg-[#b591ef]/10 text-[#b591ef]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
              )}>
              Linked Accounts
            </Button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className='lg:col-span-9'>
            {activeTab === 'general' ? (
              // ================= GENERAL TAB =================
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
                      {/* Username Field */}
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
                                placeholder='johndoe'
                                {...field}
                                className='bg-[#0d0e12] border-white/10 text-white focus-visible:ring-[#b591ef]'
                              />
                            </FormControl>
                            <FormMessage className='text-red-400' />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Date of Birth Field with Dropdowns */}
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
                                        !field.value && 'text-muted-foreground',
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
                                    captionLayout='dropdown'
                                    fromYear={1950}
                                    toYear={new Date().getFullYear()}
                                    className='bg-[#1c1c21] text-white'
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className='text-red-400' />
                            </FormItem>
                          )}
                        />

                        {/* Weekend Preference */}
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

                      {/* Time and Duration Fields */}
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

                      {/* Main Goal Field */}
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
            ) : (
              // ================= ACCOUNT TAB =================
              <div className='space-y-6'>
                <Card className='bg-[#1c1c21] border-white/10 shadow-xl'>
                  <CardHeader>
                    <CardTitle className='text-2xl text-white'>
                      Linked Accounts
                    </CardTitle>
                    <CardDescription className='text-gray-400'>
                      Manage your external account connections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* Current Email Info */}
                    <div className='flex items-center justify-between p-4 rounded-lg bg-[#0d0e12] border border-white/5'>
                      <div className='flex items-center gap-3'>
                        <Mail className='h-5 w-5 text-gray-400' />
                        <div>
                          <p className='text-sm font-medium text-white'>
                            Email Address
                          </p>
                          <p className='text-xs text-gray-400'>
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant='secondary'
                        className='bg-[#b591ef]/10 text-[#b591ef]'>
                        Primary
                      </Badge>
                    </div>

                    <Separator className='bg-white/10' />

                    {/* Social Connections */}
                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium text-gray-300'>
                        Social Connections
                      </h4>

                      {/* Google Connection */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-white flex items-center justify-center'>
                            <FaGoogle className='h-5 w-5 text-black' />
                          </div>
                          <div>
                            <p className='font-medium text-white'>Google</p>
                            <p className='text-sm text-gray-400'>
                              {isGoogleLinked
                                ? 'Calendar connected and syncing'
                                : 'Connect to sync your calendar'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={isGoogleLinked ? 'destructive' : 'default'}
                          className={cn(
                            'min-w-[100px]',
                            !isGoogleLinked &&
                              'border-white/10 text-white hover:bg-[#b591ef]/20 hover:text-[#b591ef]',
                          )}
                          onClick={handleGoogleAction}
                          disabled={isConnecting}>
                          {isConnecting ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : isGoogleLinked ? (
                            'Disconnect'
                          ) : (
                            'Connect'
                          )}
                        </Button>
                      </div>

                      {/* Apple Connection (Coming Soon) */}
                      <div className='flex items-center justify-between opacity-60'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-white flex items-center justify-center'>
                            <FaApple className='h-5 w-5 text-black' />
                          </div>
                          <div>
                            <p className='font-medium text-white'>Apple</p>
                            <div className='flex items-center gap-2'>
                              <p className='text-sm text-gray-400'>
                                Connect your Apple ID
                              </p>
                              <Badge
                                variant='outline'
                                className='text-[10px] h-4 border-yellow-500/50 text-yellow-500'>
                                Coming Soon
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          disabled
                          variant='secondary'
                          size='sm'>
                          Connect
                        </Button>
                      </div>

                      {/* Outlook Connection (Coming Soon) */}
                      <div className='flex items-center justify-between opacity-60'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-[#0078D4] flex items-center justify-center'>
                            <FaMicrosoft className='h-5 w-5 text-white' />
                          </div>
                          <div>
                            <p className='font-medium text-white'>Outlook</p>
                            <div className='flex items-center gap-2'>
                              <p className='text-sm text-gray-400'>
                                Connect your Microsoft account
                              </p>
                              <Badge
                                variant='outline'
                                className='text-[10px] h-4 border-yellow-500/50 text-yellow-500'>
                                Coming Soon
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          disabled
                          variant='secondary'
                          size='sm'>
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className='bg-[#1c1c21]/50 border-red-900/20 shadow-none'>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg text-red-400 flex items-center gap-2'>
                      <AlertCircle className='h-5 w-5' />
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm text-gray-400 mb-4'>
                      Permanently delete your account and all of your content.
                      This action cannot be undone.
                    </p>

                    {/* 👇 NEW DELETE BUTTON COMPONENT */}
                    <DeleteAccountButton />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
