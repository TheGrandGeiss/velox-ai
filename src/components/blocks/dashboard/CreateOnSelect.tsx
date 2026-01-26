'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { X, Clock, Calendar as CalendarIcon, Tag } from 'lucide-react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { eventSchema, eventSchemaType } from '@/lib/zodSchema/event';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getValidAccessToken } from '@/lib/actions/GetAccessToken';
import { useSession } from 'next-auth/react';
import { CalendarEvent } from './dashboard';
import { toast } from 'sonner';

export const categoryTypes = [
  {
    name: 'Health/Fitness',
    backgroundColor: '#C8E6C9',
    borderColor: '#2E7D32',
    textColor: '#1B5E20',
  },
  {
    name: 'Learning/Books',
    backgroundColor: '#FFCDD2',
    borderColor: '#D32F2F',
    textColor: '#B71C1C',
  },
  {
    name: 'Work/Productivity',
    backgroundColor: '#BBDEFB',
    borderColor: '#1565C0',
    textColor: '#0D47A1',
  },
  {
    name: 'Personal/Creative',
    backgroundColor: '#E1BEE7',
    borderColor: '#7B1FA2',
    textColor: '#4A148C',
  },
  {
    name: 'Chores/Errands',
    backgroundColor: '#FFE0B2',
    borderColor: '#EF6C00',
    textColor: '#BF360C',
  },
  {
    name: 'Social/Leisure',
    backgroundColor: '#B2DFDB',
    borderColor: '#00695C',
    textColor: '#004D40',
  },
  {
    name: 'Break',
    backgroundColor: '#F5F5F5',
    borderColor: '#616161',
    textColor: '#212121',
  },
] as const;

const CreateOnSelect = ({
  open,
  setOpen,
  selectedData,
  setEvents,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setEvents: Dispatch<SetStateAction<CalendarEvent[]>>;
  selectedData: {
    start: string;
    end: string;
    startDate: Date;
    endDate: Date;
    category?: CategoryType;
  } | null;
}) => {
  const isoToTimeInput = (isoString: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };
  const [loading, setLoading] = useState<boolean>(false);

  const timeInputToIso = (timeValue: string, baseIsoString: string): string => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const baseDate = new Date(baseIsoString);
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate.toISOString();
  };

  const { data: session } = useSession();

  async function handleCreate(value: eventSchemaType) {
    try {
      setLoading(true);

      const accessToken = session?.user?.id
        ? await getValidAccessToken(session.user.id)
        : '';

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Google-Token': accessToken || '',
        },
        body: JSON.stringify({
          eventTitle: value.eventTitle,
          eventDescription: value.eventDescription,
          start: value.start,
          end: value.end,
          category: value.category,
          backgroundColor: value.backgroundColor,
          borderColor: value.borderColor,
          textColor: value.textColor,
        }),
      });

      if (!response.ok) throw new Error('Failed to create event');

      const data = await response.json();

      if (data.success) {
        const newEvent: CalendarEvent = {
          id: data.event.id,
          title: value.eventTitle,
          description: value.eventDescription,
          start: new Date(value.start),
          end: value.end ? new Date(value.end) : new Date(value.start),
          category: value.category,
          backgroundColor: value.backgroundColor,
          borderColor: value.borderColor,
          textColor: value.textColor,
        };

        setEvents((prev) => [...prev, newEvent]);
        setOpen(false);
      }
    } catch (error) {
      console.error('Creation failed:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const form = useForm({
    defaultValues: {
      eventTitle: '',
      eventDescription: '',
      start: '',
      end: '',
      category: 'Break',
      allDay: false,
      backgroundColor: '#F5F5F5',
      borderColor: '#616161',
      textColor: '#212121',
    },
    validators: { onSubmit: eventSchema },
    onSubmit: async ({ value }) => {
      await handleCreate(value);
    },
  });

  useEffect(() => {
    if (open) {
      if (selectedData) {
        form.setFieldValue('start', selectedData.start);
        form.setFieldValue('end', selectedData.end);
        form.setFieldValue('eventTitle', '');
        form.setFieldValue('eventDescription', '');
      } else {
        form.setFieldValue('start', '');
        form.setFieldValue('end', '');
        form.setFieldValue('eventTitle', '');
        form.setFieldValue('eventDescription', '');
      }
    }
  }, [open, selectedData, form]);

  const handleCategoryChange = (categoryName: string) => {
    const selectedCategory = categoryTypes.find((c) => c.name === categoryName);

    if (selectedCategory) {
      form.setFieldValue('backgroundColor', selectedCategory.backgroundColor);
      form.setFieldValue('borderColor', selectedCategory.borderColor);
      form.setFieldValue('textColor', selectedCategory.textColor);
    }
  };

  const inputStyles =
    'bg-[#27272a] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#b591ef] focus-visible:border-[#b591ef] rounded-xl py-6 text-base shadow-sm transition-all duration-200';
  const labelStyles = 'text-sm font-medium text-gray-400 mb-2 block';

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        // ✅ FIX IS HERE: Added max-h-[90vh], flex, and flex-col to parent
        className='sm:max-w-[600px] max-h-[90vh] flex flex-col bg-[#1c1c21] border border-white/10 text-white p-0 gap-0 rounded-3xl overflow-hidden shadow-2xl'>
        {/* Header - Fixed */}
        <div className='flex justify-between items-center p-6 border-b border-white/10 bg-[#1c1c21] flex-shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-[#b591ef]/10 flex items-center justify-center border border-[#b591ef]/20'>
              <CalendarIcon className='w-5 h-5 text-[#b591ef]' />
            </div>
            <DialogTitle className='text-xl font-bold text-white'>
              New Event
            </DialogTitle>
          </div>
          <DialogClose className='text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors'>
            <X className='size-5' />
          </DialogClose>
        </div>

        {/* Content - Scrollable */}
        {/* ✅ FIX IS HERE: Added overflow-y-auto to allow scrolling inside the modal */}
        <div className='p-6 overflow-y-auto custom-scrollbar flex-1'>
          <form
            id='event-creation-modal'
            onSubmit={async (e) => {
              e.preventDefault();
              await form.handleSubmit();
            }}>
            <FieldGroup className='space-y-6'>
              {/* Event Title */}
              <form.Field
                name='eventTitle'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor={field.name}
                        className={labelStyles}>
                        TITLE
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='What are you planning?'
                        autoComplete='off'
                        className={`${inputStyles} text-lg font-medium`}
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors}
                          className='text-red-400 text-xs mt-1'
                        />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Time Selection Row */}
              <div className='grid grid-cols-2 gap-4'>
                <form.Field
                  name='start'
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const timeValue = field.state.value
                      ? isoToTimeInput(field.state.value)
                      : selectedData?.start
                        ? isoToTimeInput(selectedData.start)
                        : '';
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className={labelStyles}>
                          <span className='flex items-center gap-2'>
                            <Clock className='w-3 h-3' /> START
                          </span>
                        </FieldLabel>
                        <Input
                          type='time'
                          value={timeValue}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const newTime = e.target.value;
                            if (newTime) {
                              const baseIsoString =
                                field.state.value ||
                                selectedData?.start ||
                                new Date().toISOString();
                              const newIsoString = timeInputToIso(
                                newTime,
                                baseIsoString,
                              );
                              field.handleChange(newIsoString);
                            }
                          }}
                          className={`${inputStyles} [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name='end'
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const timeValue = field.state.value
                      ? isoToTimeInput(field.state.value)
                      : selectedData?.end
                        ? isoToTimeInput(selectedData.end)
                        : '';
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel
                          htmlFor={field.name}
                          className={labelStyles}>
                          <span className='flex items-center gap-2'>
                            <Clock className='w-3 h-3' /> END
                          </span>
                        </FieldLabel>
                        <Input
                          type='time'
                          value={timeValue}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const newTime = e.target.value;
                            if (newTime) {
                              const baseIsoString =
                                field.state.value ||
                                selectedData?.end ||
                                new Date().toISOString();
                              const newIsoString = timeInputToIso(
                                newTime,
                                baseIsoString,
                              );
                              field.handleChange(newIsoString);
                            }
                          }}
                          className={`${inputStyles} [&::-webkit-calendar-picker-indicator]:invert`}
                        />
                      </Field>
                    );
                  }}
                />
              </div>

              {/* Category */}
              <form.Field
                name='category'
                children={(field) => {
                  return (
                    <Field className='w-full'>
                      <FieldLabel
                        htmlFor={field.name}
                        className={labelStyles}>
                        <span className='flex items-center gap-2'>
                          <Tag className='w-3 h-3' /> CATEGORY
                        </span>
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val);
                          handleCategoryChange(val);
                        }}>
                        <SelectTrigger
                          className={`${inputStyles} border-white/10 text-white`}>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                        <SelectContent className='bg-[#1c1c21] border border-white/10 text-white shadow-xl max-h-[200px]'>
                          {categoryTypes.map((category) => (
                            <SelectItem
                              key={category.name}
                              value={category.name}
                              className='text-base py-3 cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white text-gray-300'>
                              <div className='flex items-center gap-2'>
                                <div
                                  className='w-3 h-3 rounded-full'
                                  style={{
                                    backgroundColor: category.backgroundColor,
                                  }}></div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  );
                }}
              />

              {/* Description */}
              <form.Field
                name='eventDescription'
                children={(field) => (
                  <Field>
                    <FieldLabel
                      htmlFor={field.name}
                      className={labelStyles}>
                      DESCRIPTION
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='Add details, notes, or links...'
                      className={`${inputStyles} min-h-[120px] resize-none`}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className='p-6 bg-[#151519] border-t border-white/5 flex gap-3 sm:justify-between flex-shrink-0'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => form.reset()}
            className='flex-1 sm:flex-none text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl text-base'>
            Reset
          </Button>

          <Button
            type='submit'
            form='event-creation-modal'
            disabled={loading}
            className='flex-1 sm:flex-none bg-[#b591ef] hover:bg-[#a37ee5] text-[#1a1423] font-semibold h-12 rounded-xl text-base px-8 shadow-[0_0_15px_rgba(181,145,239,0.3)] transition-all'>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOnSelect;
