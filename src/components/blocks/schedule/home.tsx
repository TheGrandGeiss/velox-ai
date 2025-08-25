'use client';

import React, { useEffect, useState } from 'react';
import ChatBotMessageField from './textarea';
import Image from 'next/image';
import Link from 'next/link';
import image from '@/assets/schdedulepageimage.png';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Message } from '@/lib/types';
import { fetchMessagesFromDB, saveMessageToDB } from '@/lib/actions/message';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const ScheduleHome = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  if (!session?.user?.id) {
    redirect('/sign-up');
  }

  useEffect(() => {
    try {
      setLoading(true);
      async function fetchMessages() {
        const chat = await fetchMessagesFromDB(session?.user?.id);

        if (!chat) {
          throw new Error('No Message');
        }

        setMessages(chat);

        setLoading(false);
      }
      fetchMessages();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  });

  const onSubmit = async (message: Message) => {
    if (!message) {
      throw new Error('No message');
    }
    setMessages((prev) => [...prev, message]);

    await saveMessageToDB(message, session?.user?.id);
  };

  return (
    <main className='bg-gray-50 '>
      <div className='min-h-screen  flex flex-col max-w-[1300px] mx-auto'>
        {/* Header with back button */}
        <div className='p-6'>
          <Link href={'/dashboard'}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full bg-calprimary text-white'>
              <ArrowLeft className='size-6' />
            </Button>
          </Link>
        </div>

        {/* Main content - centered */}
        {messages.length < 1 ? (
          <div className='flex-1 flex flex-col items-center justify-center px-6 -mt-16'>
            <div className='max-w-md text-center space-y-6'>
              {/* Image */}
              <div className='mb-8'>
                <Image
                  src={image}
                  alt='Schedule page image'
                  width={200}
                  height={200}
                  className='mx-auto'
                />
              </div>

              {/* Text content */}
              <div className='space-y-4'>
                <h1 className='text-4xl font-bold text-gray-900'>
                  Welcome to Steady!!
                </h1>
                <p className='text-xl text-gray-600'>
                  Ready to organize your day? Tell me what you need to do and{' '}
                  <span className='font-semibold text-gray-800'>
                    I'll create your perfect schedule
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>hello</div>
        )}

        {/* Bottom textarea */}
        <div className='p-6 pt-0'>
          <div className='max-w-3xl mx-auto'>
            <ChatBotMessageField
              handleSubmit={onSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ScheduleHome;
