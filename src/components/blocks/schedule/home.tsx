'use client';

import React, { useEffect, useState } from 'react';
import ChatBotMessageField from './textarea';
import Image from 'next/image';
import Link from 'next/link';
import image from '@/assets/schdedulepageimage.png';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Message } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';

const ScheduleHome = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);

        // fetching all messages
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

        const taskResponse = await fetch('/api/tasks', {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        });

        const taskData = await taskResponse.json();

        console.log('Fetched messages:', data, taskData);

        if (data.data) {
          setMessages(data.data);
        }

        if (Array.isArray(taskData.tasks)) {
          setTasks(taskData.tasks);
        } else {
          console.warn('No data in response:', data, taskData);
        }
      } catch (error) {
        // console.error('Error fetching messages:', error);
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
      if (!session?.user?.id) {
        redirect('signin');
      }

      await getValidAccessToken(session.user?.id);

      if (!message || !message.content?.trim()) {
        throw new Error('Please enter a message');
      }

      setMessages((prev) => [...prev, message]);
      console.log(message);

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
        console.log('Message saved:', data);
      } else {
        throw new Error('Failed to save message');
      }

      const scheduleResponse = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          content: message.content,
        }),
      });

      if (!scheduleResponse.ok) {
        const errorData = await scheduleResponse.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${scheduleResponse.status}`
        );
      }

      const scheduleData = await scheduleResponse.json();

      if (!scheduleData) {
        throw new Error('error fetching response');
      }

      console.log('Schedule data received:', scheduleData);
      console.log('Tasks in schedule data:', scheduleData.tasks);

      // Add AI response as a message
      const aiMessage: Message = {
        role: 'ai',
        content: 'Schedule has been added, check calendar',
        start: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Set tasks if they exist
      if (scheduleData.tasks && Array.isArray(scheduleData.tasks)) {
        setTasks(scheduleData.tasks);
        console.log('Tasks set:', scheduleData.tasks);
      } else {
        console.log('No tasks found in schedule data');
      }

      const refreshResponse = await fetch('/api/messages', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.data) {
          setMessages(refreshData.data);
        }
      }
      console.log(tasks);
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
      <div className='flex flex-col max-w-[1300px] mx-auto w-full h-screen'>
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

        {/* Main content area */}
        <div className='flex-1 flex flex-col min-h-0 overflow-hidden scrollbar-hide'>
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
            <div className='flex-1 px-6 overflow-hidden'>
              {/* Messages container with proper scrolling */}
              <div className='h-full overflow-y-auto space-y-4 py-4 scrollbar-hide'>
                {messages.map((message, index) =>
                  message.role === 'user' ? (
                    <div
                      key={index}
                      className='flex justify-end'>
                      <div className='bg-calprimary text-white max-w-xl lg:max-w-md xl:max-w-lg p-4 rounded-lg break-words'>
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div key={index}>
                      {tasks.length > 0 && (
                        <div className='mt-4 p-4 bg-white rounded-lg shadow max-w-xl'>
                          <h3 className='text-lg font-semibold mb-3 text-gray-800'>
                            Scheduled Tasks:
                          </h3>
                          <div className='space-y-2'>
                            {tasks.map((task, index) => (
                              <div
                                key={index}
                                className='p-3 border rounded-lg'
                                style={{
                                  borderLeftColor: task.backgroundColor,
                                  borderLeftWidth: '4px',
                                }}>
                                <h4 className='font-medium text-gray-800'>
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className='text-sm text-gray-600 mt-1'>
                                    {task.description}
                                  </p>
                                )}
                                <div className='flex justify-between items-center mt-2 text-xs text-gray-500'>
                                  <span>Category: {task.category}</span>
                                  <span>
                                    {new Date(task.start).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Display tasks if any */}
              {tasks.length > 0 && (
                <div className='mt-4 p-4 bg-white rounded-lg shadow'>
                  <h3 className='text-lg font-semibold mb-3 text-gray-800'>
                    Scheduled Tasks:
                  </h3>
                  <div className='space-y-2'>
                    {tasks.map((task, index) => (
                      <div
                        key={index}
                        className='p-3 border rounded-lg'
                        style={{
                          borderLeftColor: task.backgroundColor,
                          borderLeftWidth: '4px',
                        }}>
                        <h4 className='font-medium text-gray-800'>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className='text-sm text-gray-600 mt-1'>
                            {task.description}
                          </p>
                        )}
                        <div className='flex justify-between items-center mt-2 text-xs text-gray-500'>
                          <span>Category: {task.category}</span>
                          <span>{new Date(task.start).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom textarea - always at bottom */}
        <div className='p-6 pt-4 flex-shrink-0'>
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
