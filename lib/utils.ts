import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const baseUrl = (headers: Headers): string =>
  `${String(headers.get('x-forwarded-proto'))}://${String(headers.get('x-forwarded-host'))}`
