import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_BASE_URL = 'http://127.0.0.1:4010';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
