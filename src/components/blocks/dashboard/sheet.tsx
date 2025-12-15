'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Event } from '@/lib/types';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { useSession } from 'next-auth/react';

// Time options for select dropdown
const timeOptions: string[] = [
  '12:00 AM',
  '12:15 AM',
  '12:30 AM',
  '12:45 AM',
  '1:00 AM',
  '1:15 AM',
  '1:30 AM',
  '1:45 AM',
  '2:00 AM',
  '2:15 AM',
  '2:30 AM',
  '2:45 AM',
  '3:00 AM',
  '3:15 AM',
  '3:30 AM',
  '3:45 AM',
  '4:00 AM',
  '4:15 AM',
  '4:30 AM',
  '4:45 AM',
  '5:00 AM',
  '5:15 AM',
  '5:30 AM',
  '5:45 AM',
  '6:00 AM',
  '6:15 AM',
  '6:30 AM',
  '6:45 AM',
  '7:00 AM',
  '7:15 AM',
  '7:30 AM',
  '7:45 AM',
  '8:00 AM',
  '8:15 AM',
  '8:30 AM',
  '8:45 AM',
  '9:00 AM',
  '9:15 AM',
  '9:30 AM',
  '9:45 AM',
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '11:30 AM',
  '11:45 AM',
  '12:00 PM',
  '12:15 PM',
  '12:30 PM',
  '12:45 PM',
  '1:00 PM',
  '1:15 PM',
  '1:30 PM',
  '1:45 PM',
  '2:00 PM',
  '2:15 PM',
  '2:30 PM',
  '2:45 PM',
  '3:00 PM',
  '3:15 PM',
  '3:30 PM',
  '3:45 PM',
  '4:00 PM',
  '4:15 PM',
  '4:30 PM',
  '4:45 PM',
  '5:00 PM',
  '5:15 PM',
  '5:30 PM',
  '5:45 PM',
  '6:00 PM',
  '6:15 PM',
  '6:30 PM',
  '6:45 PM',
  '7:00 PM',
  '7:15 PM',
  '7:30 PM',
  '7:45 PM',
  '8:00 PM',
  '8:15 PM',
  '8:30 PM',
  '8:45 PM',
  '9:00 PM',
  '9:15 PM',
  '9:30 PM',
  '9:45 PM',
  '10:00 PM',
  '10:15 PM',
  '10:30 PM',
  '10:45 PM',
  '11:00 PM',
  '11:15 PM',
  '11:30 PM',
  '11:45 PM',
];

// Categories based on your AI prompt
const categories: string[] = [
  'Health/Fitness',
  'Learning/Books',
  'Work/Productivity',
  'Personal/Creative',
  'Chores/Errands',
  'Social/Leisure',
];

interface EditedEventState {
  title: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
}

interface EventEditSheetProps {
  eventDetails: Event | undefined;
  onCancel?: () => void;
  onEventUpdated?: (updatedEvent: Event) => void;
}

const EventEditSheet: React.FC<EventEditSheetProps> = ({
  eventDetails,
  onCancel,
  onEventUpdated,
}) => {
  // Helper function to format time for display (ISO to 12-hour format)
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Convert to 12-hour format
    let displayHour = hour;
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      displayHour = 12;
    } else if (hour > 12) {
      displayHour = hour - 12;
    }

    // Round minutes to nearest 15-minute interval
    let displayMinute = 0;
    if (minute < 8) {
      displayMinute = 0;
    } else if (minute < 23) {
      displayMinute = 15;
    } else if (minute < 38) {
      displayMinute = 30;
    } else if (minute < 53) {
      displayMinute = 45;
    } else {
      displayMinute = 0;
      // Move to next hour
      if (displayHour === 12) {
        displayHour = 1;
      } else {
        displayHour += 1;
      }
    }

    return `${displayHour}:${displayMinute.toString().padStart(2, '0')} ${period}`;
  };

  const [editedEvent, setEditedEvent] = useState<EditedEventState>({
    title: eventDetails?.title || '',
    description: eventDetails?.description || '',
    category: eventDetails?.category || '',
    startTime: eventDetails?.start ? formatTime(eventDetails.start) : '',
    endTime: eventDetails?.end ? formatTime(eventDetails.end) : '',
  });
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!eventDetails) return;

    try {
      const accessToken =
        session?.user?.id && (await getValidAccessToken(session.user.id));

      // Convert times back to full datetime ISO strings
      const startDateTime = combineDateTime(
        eventDetails.start,
        editedEvent.startTime
      );
      const endDateTime = eventDetails.end
        ? combineDateTime(eventDetails.end, editedEvent.endTime)
        : undefined;

      // Call the API to update the event
      const response = await fetch(`/api/events/${eventDetails.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Google-Token': accessToken || '',
        },
        body: JSON.stringify({
          title: editedEvent.title,
          description: editedEvent.description,
          category: editedEvent.category,
          start: startDateTime,
          end: endDateTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert('Event updated successfully!');
        // Close the sheet
        setIsOpen(false);
        // Call the callback to update the event in the parent component
        if (onEventUpdated && data.event) {
          onEventUpdated(data.event);
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleCancel = (): void => {
    setEditedEvent({
      title: eventDetails?.title || '',
      description: eventDetails?.description || '',
      category: eventDetails?.category || '',
      startTime: eventDetails?.start ? formatTime(eventDetails.start) : '',
      endTime: eventDetails?.end ? formatTime(eventDetails.end) : '',
    });
    setIsOpen(false);
    onCancel?.();
  };

  // Helper function to combine date with new time
  const combineDateTime = (originalISO: string, newTime: string): string => {
    if (!originalISO || !newTime) return originalISO;

    const originalDate = new Date(originalISO);
    const [time, period] = newTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    originalDate.setHours(hour24, minutes, 0, 0);
    return originalDate.toISOString();
  };

  return (
    <>
      <div className='space-y-6 py-6'>
        {/* Event Title */}
        <div className='space-y-2'>
          <Label
            htmlFor='title'
            className='text-sm font-semibold text-gray-700'>
            Event Title
          </Label>
          <Input
            id='title'
            value={editedEvent.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditedEvent({ ...editedEvent, title: e.target.value })
            }
            placeholder='Enter event title'
            className='w-full'
          />
        </div>

        {/* Description */}
        <div className='space-y-2'>
          <Label
            htmlFor='description'
            className='text-sm font-semibold text-gray-700'>
            Description
          </Label>
          <Textarea
            id='description'
            value={editedEvent.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditedEvent({ ...editedEvent, description: e.target.value })
            }
            placeholder='Enter event description'
            rows={3}
            className='w-full resize-none'
          />
        </div>

        {/* Category */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-gray-700'>
            Category
          </Label>
          <Select
            value={editedEvent.category}
            onValueChange={(value: string) =>
              setEditedEvent({ ...editedEvent, category: value })
            }>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: string) => (
                <SelectItem
                  key={category}
                  value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Time */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-gray-700'>
            Start Time
          </Label>
          <Select
            value={editedEvent.startTime}
            onValueChange={(value: string) =>
              setEditedEvent({ ...editedEvent, startTime: value })
            }>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select start time' />
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              {timeOptions.map((time: string) => (
                <SelectItem
                  key={time}
                  value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* End Time */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-gray-700'>
            End Time
          </Label>
          <Select
            value={editedEvent.endTime}
            onValueChange={(value: string) =>
              setEditedEvent({ ...editedEvent, endTime: value })
            }>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select end time' />
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              {timeOptions.map((time: string) => (
                <SelectItem
                  key={time}
                  value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='absolute bottom-6 left-6 right-6 flex space-x-3 border-t pt-6 bg-white'>
        <Button
          onClick={handleCancel}
          variant='outline'
          className='flex-1'>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className='flex-1 bg-blue-600 hover:bg-blue-700'
          disabled={!editedEvent.title.trim()}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default EventEditSheet;
