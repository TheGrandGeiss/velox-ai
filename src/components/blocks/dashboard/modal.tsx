'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Event } from '@/lib/types';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { useSession } from 'next-auth/react';
import {
  Clock,
  Tag,
  AlignLeft,
  Calendar as CalendarIcon,
  X,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

// Re-using the colorful categories for better UI
const categoryConfig: Record<string, string> = {
  'Health/Fitness': '#C8E6C9',
  'Learning/Books': '#FFCDD2',
  'Work/Productivity': '#BBDEFB',
  'Personal/Creative': '#E1BEE7',
  'Chores/Errands': '#FFE0B2',
  'Social/Leisure': '#B2DFDB',
};

// Time options (Kept your logic)
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

interface EditedEventState {
  title: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
}

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventDetails: Event | undefined;
  onEventUpdated?: (updatedEvent: Event) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  onOpenChange,
  eventDetails,
  onEventUpdated,
}) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // --- TIME FORMATTING LOGIC (PRESERVED) ---
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hour = date.getHours();
    const minute = date.getMinutes();
    let displayHour = hour;
    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) displayHour = 12;
    else if (hour > 12) displayHour = hour - 12;

    let displayMinute = 0;
    if (minute < 8) displayMinute = 0;
    else if (minute < 23) displayMinute = 15;
    else if (minute < 38) displayMinute = 30;
    else if (minute < 53) displayMinute = 45;
    else {
      displayMinute = 0;
      if (displayHour === 12) displayHour = 1;
      else displayHour += 1;
    }
    return `${displayHour}:${displayMinute.toString().padStart(2, '0')} ${period}`;
  };

  const [editedEvent, setEditedEvent] = useState<EditedEventState>({
    title: '',
    description: '',
    category: '',
    startTime: '',
    endTime: '',
  });

  // Sync state when eventDetails changes
  useEffect(() => {
    if (eventDetails) {
      setEditedEvent({
        title: eventDetails.title || '',
        description: eventDetails.description || '',
        category: eventDetails.category || '',
        startTime: eventDetails.start ? formatTime(eventDetails.start) : '',
        endTime: eventDetails.end ? formatTime(eventDetails.end) : '',
      });
    }
  }, [eventDetails]);

  const handleSave = async () => {
    if (!eventDetails) return;
    setLoading(true);

    try {
      const accessToken =
        session?.user?.id && (await getValidAccessToken(session.user.id));

      const startDateTime = combineDateTime(
        eventDetails.start,
        editedEvent.startTime,
      );
      const endDateTime = eventDetails.end
        ? combineDateTime(eventDetails.end, editedEvent.endTime)
        : undefined;

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

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        onOpenChange(false);
        if (onEventUpdated && data.event) {
          onEventUpdated(data.event);
        }
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event.');
    } finally {
      setLoading(false);
    }
  };

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

  // --- STYLES ---
  const inputStyles =
    'bg-[#27272a] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#b591ef] focus-visible:border-[#b591ef] rounded-xl py-6 text-base shadow-sm';
  const labelStyles =
    'text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] bg-[#1c1c21] border border-white/10 text-white p-0 gap-0 rounded-3xl overflow-hidden shadow-2xl'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b border-white/10 bg-[#1c1c21]'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-[#b591ef]/10 flex items-center justify-center border border-[#b591ef]/20'>
              <CalendarIcon className='w-5 h-5 text-[#b591ef]' />
            </div>
            <DialogTitle className='text-xl font-bold text-white'>
              Edit Event
            </DialogTitle>
          </div>
          <DialogClose className='text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors'>
            <X className='size-5' />
          </DialogClose>
        </div>

        {/* Body */}
        <div className='p-6 space-y-6'>
          {/* Title Input */}
          <div className='space-y-1'>
            <label className={labelStyles}>Event Title</label>
            <Input
              value={editedEvent.title}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, title: e.target.value })
              }
              className={`${inputStyles} text-lg font-medium`}
              placeholder='Event name'
            />
          </div>

          {/* Time Selection */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <label className={labelStyles}>
                <Clock className='w-3 h-3' /> Start
              </label>
              <Select
                value={editedEvent.startTime}
                onValueChange={(val) =>
                  setEditedEvent({ ...editedEvent, startTime: val })
                }>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder='Start time' />
                </SelectTrigger>
                <SelectContent className='bg-[#1c1c21] border border-white/10 text-white max-h-60'>
                  {timeOptions.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className='focus:bg-white/10 focus:text-white cursor-pointer'>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1'>
              <label className={labelStyles}>
                <Clock className='w-3 h-3' /> End
              </label>
              <Select
                value={editedEvent.endTime}
                onValueChange={(val) =>
                  setEditedEvent({ ...editedEvent, endTime: val })
                }>
                <SelectTrigger className={inputStyles}>
                  <SelectValue placeholder='End time' />
                </SelectTrigger>
                <SelectContent className='bg-[#1c1c21] border border-white/10 text-white max-h-60'>
                  {timeOptions.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className='focus:bg-white/10 focus:text-white cursor-pointer'>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className='space-y-1'>
            <label className={labelStyles}>
              <Tag className='w-3 h-3' /> Category
            </label>
            <Select
              value={editedEvent.category}
              onValueChange={(val) =>
                setEditedEvent({ ...editedEvent, category: val })
              }>
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder='Select Category' />
              </SelectTrigger>
              <SelectContent className='bg-[#1c1c21] border border-white/10 text-white'>
                {Object.keys(categoryConfig).map((cat) => (
                  <SelectItem
                    key={cat}
                    value={cat}
                    className='focus:bg-white/10 focus:text-white cursor-pointer py-3'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: categoryConfig[cat] }}
                      />
                      {cat}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className='space-y-1'>
            <label className={labelStyles}>
              <AlignLeft className='w-3 h-3' /> Description
            </label>
            <Textarea
              value={editedEvent.description}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, description: e.target.value })
              }
              className={`${inputStyles} min-h-[100px] resize-none`}
              placeholder='Add details...'
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className='p-6 bg-[#151519] border-t border-white/5 flex gap-3 sm:justify-between'>
          {/* You could add a Delete button here on the left if you wanted */}
          <div className='flex-1'></div>

          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            className='text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl'>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className='bg-[#b591ef] hover:bg-[#a37ee5] text-[#1a1423] font-semibold h-12 rounded-xl px-6 shadow-[0_0_15px_rgba(181,145,239,0.3)]'>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
