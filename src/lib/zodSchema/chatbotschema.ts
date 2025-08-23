import * as z from 'zod';
export const messageSchema = z.object({
  text: z.string().min(5),
});

export type messageSchemaType = z.infer<typeof messageSchema>;
