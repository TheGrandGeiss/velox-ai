'use client';

import React, { useEffect, useState } from 'react';
import ChatBotMessageField from './textarea';
import Image from 'next/image';
import Link from 'next/link';
import image from '@/assets/schdedulepageimage.png';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Message } from '@/lib/types';

const ScheduleHome = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/messages', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log('Fetched messages:', data);

        if (data.data) {
          setMessages(data.data);
        } else {
          console.warn('No data in response:', data);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        // You could add a toast notification here instead of alert
        alert(
          error instanceof Error ? error.message : 'Failed to fetch messages'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const onSubmit = async (message: Message) => {
    try {
      setLoading(true);

      if (!message || !message.content?.trim()) {
        throw new Error('Please enter a message');
      }

      setMessages((prev) => [...prev, message]);
      console.log(message);

      const uploadResponse = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(
          'i need to sleep tomorrow morning, read at night and workout in the afternoon'
        ),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${uploadResponse.status}`
        );
      }

      const uploadData = await uploadResponse.json();

      console.log({ data: uploadData });

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success) {
        // Message saved successfully
        console.log('Message saved:', data);
      } else {
        throw new Error('Failed to save message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);

      setMessages((prev) => prev.filter((msg) => msg !== message));

      alert(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='bg-gray-50 min-h-screen flex flex-col'>
      <div className='flex flex-col max-w-[1300px] mx-auto w-full flex-1'>
        {/* Header with back button */}
        <div className='p-6 flex-shrink-0'>
          <Link href={'/dashboard'}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full bg-calprimary text-white'>
              <ArrowLeft className='size-6' />
            </Button>
          </Link>
        </div>

        {/* Main content - centered with flex-1 to push textarea to bottom */}
        <div className='flex-1 flex flex-col'>
          {messages.length == 0 ? (
            <div className='flex-1 flex flex-col items-center justify-center px-6'>
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
            <div className='flex-1 px-6'>
              {/* Messages display area */}
              <div className='space-y-4'>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-calprimary text-white ml-auto max-w-xs'
                        : 'bg-gray-200 text-gray-800 mr-auto max-w-xs'
                    }`}>
                    {message.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom textarea - always at bottom */}
        <div className='p-6 pt-0 mt-auto flex-shrink-0'>
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
