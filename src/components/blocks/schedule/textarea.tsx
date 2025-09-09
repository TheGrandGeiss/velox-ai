'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp } from 'lucide-react';
import React, { useState } from 'react';
import { Message } from '@/lib/types';

type ChatBotMessageFieldProps = {
  handleSubmit: (message: Message) => void | Promise<void>;
  loading: boolean;
};

const ChatBotMessageField = ({
  handleSubmit,
  loading,
}: ChatBotMessageFieldProps) => {
  const [inputText, setInputText] = useState('');

  const submitMessage = async () => {
    if (!inputText.trim()) return;

    const message: Message = {
      role: 'user',
      content: inputText.trim(),
      start: new Date().toISOString(),
    };
    try {
      await handleSubmit(message);
      setInputText('');
    } catch (error) {
      setInputText(inputText);
      console.error('Failed to submit message:', error);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(e.target.value);
  }

  return (
    <div className='relative w-full'>
      <Textarea
        className='min-h-[140px] w-full bg-gray-200 border-gray-200 rounded-3xl placeholder:text-xl placeholder:p-1 ring-calprimary focus-visible:border-calprimary focus-visible:ring-[1px] md:text-2xl md:text-gray-800 resize-none md:p-0.5'
        placeholder="Tell me about your tasks and I'll help you schedule them..."
        onKeyDown={handleKeyDown}
        value={inputText}
        onChange={handleChange}
        disabled={loading}
      />
      <Button
        size={'icon'}
        onClick={submitMessage}
        disabled={loading || !inputText.trim()}
        className='bg-calprimary rounded-full absolute right-3 p-2 bottom-3 w-auto h-auto disabled:opacity-50'>
        {loading ? (
          <div className='loader'></div>
        ) : (
          <ArrowUp className='size-6' />
        )}
      </Button>
    </div>
  );
};

export default ChatBotMessageField;
