import * as z from 'zod';

export const eventSchema = z.object({
  eventTitle: z
    .string()
    .min(5, 'keep the title between 5 and 40 characters')
    .max(5, 'keep the title between 5 and 40 characters'),
  eventDescription: z
    .string()
    .min(5, 'keep the title between 15 and 120 characters')
    .max(5, 'keep the title between 15 and 120 characters'),
  start: z.union([z.date(), z.string()]),
  end: z.union([z.date(), z.string()]),
  allDay: z.boolean(),
  backgroundColor: z.string(),
  textColor: z.string(),
  borderColor: z.string(),
});

export type eventSchemaType = z.infer<typeof eventSchema>;
