import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { randomUUID } from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateGoogleCalendarId() {
  // 1. Generate standard UUID: "123e4567-e89b-..."
  const uuid = randomUUID();

  // 2. Remove dashes to satisfy Google's "base32hex" rule
  return uuid.replace(/-/g, '');
}
