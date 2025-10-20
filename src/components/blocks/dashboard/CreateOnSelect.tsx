import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { X } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from '@tanstack/react-form';
import { eventSchema } from '@/lib/zodSchema/event';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CreateOnSelect = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm({
    defaultValues: {
      eventTitle: '',
      eventDescription: '',
      start: new Date(),
      end: new Date(),
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

        <form>
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
                      className='border-0 focus-visible:ring-0 bg-slate-50 shadow-none rounded-md py-6 placeholder:text-gray-500 text-lg'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* picker forms */}
            <div className='flex justify-between items-center gap-4'></div>

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
                      className='border-0 focus-visible:ring-0 bg-slate-50 shadow-none rounded-md  placeholder:text-gray-500 text-lg resize-none min-h-[120px]'
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOnSelect;
