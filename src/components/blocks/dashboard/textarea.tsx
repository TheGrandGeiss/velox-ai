import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp } from 'lucide-react';
import React from 'react';

const ChatBotMessageField = () => {
  return (
    <div className='relative w-full'>
      <Textarea
        className='min-h-[140px] w-full border-gray-200 rounded-2xl placeholder:text-xl ring-calprimary focus-visible:border-calprimary focus-visible:ring-[1px]'
        placeholder="Tell me about your tasks and I'll help you schedule them..."
      />
      <Button
        size={'icon'}
        className='bg-calprimary rounded-full p-5 absolute'>
        {' '}
        <ArrowUp size={30} />
      </Button>
    </div>
  );
};

export default ChatBotMessageField;
