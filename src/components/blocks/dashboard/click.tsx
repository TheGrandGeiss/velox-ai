'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';

const Click = () => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);

  async function create() {
    // 1. Setup
    setMessage(null);
    setIsLoading(true);

    // Set up start time (now) and end time (2 hours from now)
    if (!session?.user?.id) throw new Error('no user');

    await getValidAccessToken(session.user.id);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 2);

    // Get the user's local timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      // 2. API Call
      const response = await fetch('/api/google/events/create', {
        method: 'POST',
        headers: {
          // Note: Standard practice uses 'application/json' (lowercase)
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          summary: 'stuff',
          description: 'more stuffs',
          start: {
            dateTime: startDate.toISOString(),
            timeZone: userTimeZone,
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: userTimeZone,
          },
        }),
      });

      // 3. Process Response Body
      // Safely try to parse JSON. Use the body (data) for error messages.
      const data = await response.json().catch(() => ({}));

      // 4. Error Check: THE STANDARD WAY
      if (!response.ok) {
        // If response.ok is false (status 4xx or 5xx)
        const errorMessage =
          data?.message ||
          data?.error ||
          'Failed to create event due to a server error.';
        setMessage(errorMessage);
        alert(`Error: ${errorMessage}`); // Alert the specific error
        return;
      }

      // 5. Success
      const successMessage = 'Event created successfully!';
      setMessage(successMessage);
      alert(successMessage);
      console.log(data.event);

      // Optional: Handle the success data if needed (e.g., event ID from data.event)
      // console.log('New Event Data:', data.event);
    } catch (err) {
      // 6. Network/System Error
      const networkErrorMessage =
        'A network error occurred. Check your connection.';
      console.error('Fetch Error:', err);
      setMessage(networkErrorMessage);
      alert(networkErrorMessage);
    } finally {
      // 7. Cleanup
      setIsLoading(false);
    }
  }

  async function getEvents() {
    const response = await fetch('/api/google/events/getEvents');

    if (!response.ok) {
      throw new Error('error fetching events');
    }
    const data = await response.json();

    console.log(data);
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
