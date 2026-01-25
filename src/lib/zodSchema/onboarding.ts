import z from 'zod';
import { WeekendPreference } from '@/generated/client';

export const sessionLength = [
  '15',
  '30',
  '45',
  '60',
  '90',
  '120',
  '150',
  '180',
];

export const userPreferenceSchema = z.object({
  username: z
    .string('this field is required')
    .min(3, 'minimum of 3 characters'),
  dob: z.date('birthdate is required'),
  mainGoal: z
    .string('this field is required')
    .max(300, 'max of 300 characters'),
  maxSessionLength: z.enum(sessionLength, 'please select an option'),
  weekendPreference: z.nativeEnum(WeekendPreference, 'please select an option'),
  wakeUpTime: z.string('this field is required'),
  sleepTime: z.string('this field is required'),
});

export type userPreferenceType = z.infer<typeof userPreferenceSchema>;
