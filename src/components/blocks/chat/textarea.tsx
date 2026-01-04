'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputText]);

  const submitMessage = async () => {
    if (!inputText.trim()) return;

    const message: Message = {
      role: 'user',
      content: inputText.trim(),
      start: new Date().toISOString(),
    };

    // UX: Clear immediately
    const textToSend = inputText;
    setInputText('');

    // Reset height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      await handleSubmit(message);
    } catch (error) {
      setInputText(textToSend); // Restore if failed
      console.error('Failed to submit message:', error);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  }

  return (
    <div className='relative w-full group'>
      {/* Glow Effect */}
      <div className='absolute -inset-0.5 bg-gradient-to-r from-[#b591ef]/20 to-blue-600/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500'></div>

      <div className='relative bg-[#1c1c21] rounded-[1.5rem] border border-white/10 shadow-xl overflow-hidden'>
        <Textarea
          ref={textareaRef}
          className='min-h-[60px] max-h-[200px] w-full bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-500 text-lg resize-none py-4 pl-6 pr-14 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'
          placeholder='Tell me about your tasks...'
          onKeyDown={handleKeyDown}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={1}
        />

        <div className='absolute right-2 bottom-2'>
          <Button
            size='icon'
            onClick={submitMessage}
            disabled={loading || !inputText.trim()}
            className='h-10 w-10 rounded-full bg-[#b591ef] hover:bg-[#a37ce5] text-[#1a1423] disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 transition-all shadow-lg shadow-purple-900/20'>
            {loading ? (
              <Loader2 className='h-5 w-5 animate-spin' />
            ) : (
              <ArrowUp className='h-6 w-6' />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotMessageField;
