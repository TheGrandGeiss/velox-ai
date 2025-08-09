import z from 'zod';

export const SignUpSchema = z.object({
  email: z.email(),
  terms: z.boolean('terms and condition must be accepted'),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
