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
import { X } from 'lucide-react';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { eventSchema } from '@/lib/zodSchema/event';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CategoryType } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    name: 'Default',
    backgroundColor: '#F5F5F5',
    borderColor: '#616161',
    textColor: '#212121',
  },
] as const;

const CreateOnSelect = ({
  open,
  setOpen,
  selectedData,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedData: {
    start: string;
    end: string;
    startDate: Date;
    endDate: Date;
    category?: CategoryType;
  } | null;
}) => {
  // Helper function to convert ISO string to time input format (HH:mm)
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

  // Helper function to convert time input (HH:mm) back to ISO string
  const timeInputToIso = (timeValue: string, baseIsoString: string): string => {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const baseDate = new Date(baseIsoString);
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate.toISOString();
  };

  function formatTimeForInput(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const form = useForm({
    defaultValues: {
      eventTitle: '',
      eventDescription: '',
      date: new Date(),
      start: '',
      end: '',
      category: 'Default',
      allDay: false,
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderColor: '#3b82f6',
    },
    validators: { onSubmit: eventSchema },
    onSubmit: ({ value }) => {
      console.log(value);
    },
  });

  // Update form values when selectedData changes or dialog opens
  useEffect(() => {
    if (open) {
      if (selectedData) {
        // Set all form values when dialog opens with selectedData
        form.setFieldValue('start', selectedData.start);
        form.setFieldValue('end', selectedData.end);
        form.setFieldValue('date', selectedData.startDate);
        form.setFieldValue('eventTitle', '');
        form.setFieldValue('eventDescription', '');
      } else {
        // Reset form when dialog opens without selectedData
        form.setFieldValue('start', '');
        form.setFieldValue('end', '');
        form.setFieldValue('date', new Date());
        form.setFieldValue('eventTitle', '');
        form.setFieldValue('eventDescription', '');
      }
    }
  }, [open, selectedData, form]);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className='sm:max-w-[800px]'>
        <div className='flex justify-between items-center '>
          <DialogTitle className='text-3xl font-bold text-black mb-2'>
            Create Event
          </DialogTitle>
          <DialogClose className='border border-gray-300 rounded-md p-2'>
            <X className='size-6' />
          </DialogClose>
        </div>

        <form id='event-creation-modal'>
          <FieldGroup className='gap-5'>
            <form.Field
              name='eventTitle'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className='text-xl text-slate-700'>
                      Event name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Enter Event name'
                      autoComplete='off'
                      className='border border-slate-200 focus-visible:ring-slate-900 focus-visible:ring-1/2 bg-slate-50 shadow-none rounded-md py-6 placeholder:text-gray-500 text-lg'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* picker forms */}
            {/* <div className='flex justify-between items-center gap-4'></div> */}

            {/* description */}
            <form.Field
              name='eventDescription'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className='text-xl text-slate-700'>
                      Event description
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Enter Event Description'
                      autoComplete='off'
                      className='border border-slate-200 focus-visible:ring-slate-900 focus-visible:ring-1/2 bg-slate-50 shadow-none rounded-md  placeholder:text-gray-500 text-lg resize-none min-h-[80px]'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            <div className='flex gap-4 justify-between items-center'>
              {/* start time picker */}
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
                        className='text-xl text-slate-700'>
                        Start Time
                      </FieldLabel>
                      <Input
                        type='time'
                        id={field.name}
                        name={field.name}
                        value={timeValue}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const newTime = e.target.value;
                          if (newTime) {
                            // Use current field value as base, or fallback to selectedData or current date
                            const baseIsoString =
                              field.state.value ||
                              selectedData?.start ||
                              new Date().toISOString();
                            const newIsoString = timeInputToIso(
                              newTime,
                              baseIsoString
                            );
                            field.handleChange(newIsoString);
                          }
                        }}
                        aria-invalid={isInvalid}
                        className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none text-gray-700 focus-visible:ring-0  bg-slate-50 shadow-none rounded-md py-6 '
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* end time picker */}
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
                        className='text-xl text-slate-700'>
                        End Time
                      </FieldLabel>
                      <Input
                        type='time'
                        id={field.name}
                        name={field.name}
                        value={timeValue}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const newTime = e.target.value;
                          if (newTime) {
                            // Use current field value as base, or fallback to selectedData or current date
                            const baseIsoString =
                              field.state.value ||
                              selectedData?.end ||
                              new Date().toISOString();
                            const newIsoString = timeInputToIso(
                              newTime,
                              baseIsoString
                            );
                            field.handleChange(newIsoString);
                          }
                        }}
                        aria-invalid={isInvalid}
                        className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none text-gray-700 focus-visible:ring-0 text-4xl bg-slate-50 shadow-none rounded-md py-6 '
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name='category'
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field
                      data-invalid={isInvalid}
                      className='w-full' // Ensure field takes available width
                    >
                      {/* 1. Added Label to match alignment with Time inputs */}
                      <FieldLabel
                        htmlFor={field.name}
                        className='text-xl text-slate-700'>
                        Category
                      </FieldLabel>

                      {/* 2. Styled SelectTrigger to match Input/Textarea */}
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}>
                        <SelectTrigger
                          id={field.name}
                          aria-invalid={isInvalid}
                          className='w-full py-6 border border-slate-200 bg-slate-50 shadow-none rounded-md text-lg text-gray-700 focus:ring-slate-900 focus:ring-1 focus:outline-none'>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                        <SelectContent
                          position='item-aligned'
                          className='w-full bg-white border-slate-200'>
                          {categoryTypes.map((category) => (
                            <SelectItem
                              key={category.name}
                              value={category.name}
                              className='text-lg py-3 cursor-pointer hover:bg-slate-50'>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </FieldGroup>
        </form>
        <DialogFooter className=''>
          {' '}
          <Field
            className='flex items-center'
            orientation='horizontal'>
            <Button
              type='button'
              variant='default'
              onClick={() => form.reset()}
              className='w-1/2 bg-black text-lg py-5'>
              Reset
            </Button>

            <Button
              type='submit'
              form='event-creation-modal'
              className=' bg-green-600 w-1/2 text-lg py-5'>
              Save
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOnSelect;
