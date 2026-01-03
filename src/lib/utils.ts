import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | undefined) {
  if (!name) return '??';

  const parts = name.trim().split(' ');

  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // If "John" -> "JO" (First 2 chars)
  return name.substring(0, 2).toUpperCase();
}
