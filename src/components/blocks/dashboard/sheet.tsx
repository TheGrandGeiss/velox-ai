import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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

// Time options for select dropdown
const timeOptions: string[] = [
  '12:00 AM',
  '12:30 AM',
  '1:00 AM',
  '1:30 AM',
  '2:00 AM',
  '2:30 AM',
  '3:00 AM',
  '3:30 AM',
  '4:00 AM',
  '4:30 AM',
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
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
  onSave: (updatedEvent: Event) => Promise<void>;
  onCancel?: () => void;
}

const EventEditSheet: React.FC<EventEditSheetProps> = ({
  eventDetails,
  onSave,
  onCancel,
}) => {
  // Helper function to format time for display (ISO to 12-hour format)
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const [editedEvent, setEditedEvent] = useState<EditedEventState>({
    title: eventDetails?.title || '',
    description: eventDetails?.description || '',
    category: eventDetails?.category || '',
    startTime: eventDetails?.start ? formatTime(eventDetails.start) : '',
    endTime: eventDetails?.end ? formatTime(eventDetails.end) : '',
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!eventDetails) return;

    // Convert times back to full datetime ISO strings
    const startDateTime = combineDateTime(
      eventDetails.start,
      editedEvent.startTime
    );
    const endDateTime = eventDetails.end
      ? combineDateTime(eventDetails.end, editedEvent.endTime)
      : undefined;

    const updatedEvent: Event = {
      ...eventDetails,
      title: editedEvent.title,
      description: editedEvent.description,
      category: editedEvent.category,
      start: startDateTime,
      end: endDateTime,
    };

    await onSave(updatedEvent);
    setIsOpen(false);
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
    <Sheet
      open={isOpen}
      onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2'>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            />
          </svg>
          <span>Edit</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='w-full sm:w-96 bg-white'>
        <SheetHeader>
          <SheetTitle className='text-xl font-bold text-gray-900'>
            Edit Event
          </SheetTitle>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  );
};

export default EventEditSheet;
