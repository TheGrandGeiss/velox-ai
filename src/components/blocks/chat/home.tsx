'use client';

import React, { useEffect, useState, useRef } from 'react';
import ChatBotMessageField from '@/components/blocks/chat/textarea'; // Adjust path if needed
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Bot } from 'lucide-react';
import { Message } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { cn } from '@/lib/utils';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

const ScheduleHome = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, tasks]);

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
    <main
      className={`bg-[#0d0e12] min-h-screen flex flex-col ${outfit.className}`}>
      <div className='flex flex-col max-w-4xl mx-auto w-full h-screen relative'>
        {/* Header */}
        <div className='p-6 flex items-center justify-between flex-shrink-0 z-10'>
          <Link href={'/dashboard'}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full bg-[#1c1c21] text-white hover:bg-white/10 border border-white/5'>
              <ArrowLeft className='size-5' />
            </Button>
          </Link>
          <div className='flex items-center gap-2 px-4 py-1.5 bg-[#1c1c21] rounded-full border border-white/5'>
            <Sparkles className='w-4 h-4 text-[#b591ef]' />
            <span className='text-sm font-medium text-gray-200'>Velox AI</span>
          </div>
          <div className='w-10' />
        </div>

        {/* Main Chat Area */}
        <div
          ref={scrollRef}
          className='flex-1 overflow-y-auto scrollbar-hide scrollbar-thumb-[#28282d] scrollbar-track-transparent px-4 pb-4'>
          {messages.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500'>
              <div className='relative mb-8'>
                <div className='absolute inset-0 bg-[#b591ef] blur-[60px] opacity-20 rounded-full'></div>
                <div className='relative h-24 w-24 bg-[#1c1c21] rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl'>
                  <Bot className='w-12 h-12 text-[#b591ef]' />
                </div>
              </div>

              <h1 className='text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight'>
                Welcome to Velox
              </h1>
              <p className='text-lg text-gray-400 max-w-md mx-auto leading-relaxed'>
                Ready to organize your day? Tell me what you need to do and
                <span className='text-[#b591ef] font-medium'>
                  {' '}
                  I'll create your perfect schedule.
                </span>
              </p>
            </div>
          ) : (
            <div className='space-y-6 py-4'>
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={index}
                    className={cn(
                      'flex w-full',
                      isUser ? 'justify-end' : 'justify-start'
                    )}>
                    <div
                      className={cn(
                        'max-w-[85%] lg:max-w-[70%] rounded-2xl p-4 shadow-md',
                        isUser
                          ? 'bg-[#b591ef] text-[#1a1423] rounded-tr-sm'
                          : 'bg-[#1c1c21] text-gray-100 border border-white/5 rounded-tl-sm'
                      )}>
                      <p className='whitespace-pre-wrap text-[15px] leading-relaxed'>
                        {message.content}
                      </p>

                      {/* Render Tasks if they exist for this message context */}
                      {!isUser &&
                        tasks.length > 0 &&
                        index === messages.length - 1 && (
                          <div className='mt-4 pt-4 border-t border-white/10'>
                            <p className='text-xs font-bold text-gray-500 uppercase tracking-widest mb-3'>
                              Suggested Schedule
                            </p>
                            <div className='space-y-2'>
                              {tasks.map((task, i) => (
                                <div
                                  key={i}
                                  className='p-3 bg-[#0d0e12] rounded-lg border-l-4 border-[#b591ef] '>
                                  <h4 className='font-semibold text-white text-sm'>
                                    {task.title}
                                  </h4>
                                  {task.description && (
                                    <p className='text-gray-400 text-xs mt-1'>
                                      {task.description}
                                    </p>
                                  )}
                                  <div className='flex justify-between mt-2 text-[10px] text-gray-500'>
                                    <span>{task.category}</span>
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
                  </div>
                );
              })}

              {loading && (
                <div className='flex justify-start'>
                  <div className='bg-[#1c1c21] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-2 items-center'>
                    <div
                      className='w-2 h-2 bg-[#b591ef] rounded-full animate-bounce'
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className='w-2 h-2 bg-[#b591ef] rounded-full animate-bounce'
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className='w-2 h-2 bg-[#b591ef] rounded-full animate-bounce'
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className='p-4 pb-6 md:p-6 flex-shrink-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12] to-transparent'>
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
