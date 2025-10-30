import * as z from 'zod';

export const eventSchema = z.object({
  eventTitle: z
    .string()
    .min(5, 'keep the title between 5 and 40 characters')
    .max(40, 'keep the title between 5 and 40 characters'),
  eventDescription: z
    .string()
    .min(5, 'keep the title between 15 and 120 characters')
    .max(200, 'keep the title between 15 and 120 characters'),
  date: z.date('a start date is required'),
  start: z.string('an start time is required'),
  end: z.string('an end time is required'),
  allDay: z.boolean(),
  backgroundColor: z.string(),
  textColor: z.string(),
  borderColor: z.string(),
});

export type eventSchemaType = z.infer<typeof eventSchema>;
