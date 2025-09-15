'use client';

import React, { useState } from 'react';

const Click = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function create() {
    setMessage(null);
    setIsLoading(true);
    const startDate = new Date();
    const endDate = new Date();

    endDate.setHours(endDate.getHours() + 2);
    try {
      const response = await fetch('/api/google/events/create', {
        method: 'POST',
        headers: {
          'Content-type': 'Application/json',
        },
        body: JSON.stringify({
          summary: 'stuff',
          description: 'more stuffs',
          start: {
            dateTime: startDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(data?.message || 'Failed to create event');
        return;
      }
      setMessage('Event created');
    } catch (err) {
      setMessage('Network error');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='flex flex-col gap-2'>
      <button
        disabled={isLoading}
        onClick={create}>
        {isLoading ? 'Creating...' : 'Create event'}
      </button>
      {message ? (
        <span className='text-sm text-gray-600'>{message}</span>
      ) : null}
    </div>
  );
};

export default Click;
