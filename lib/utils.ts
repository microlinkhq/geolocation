import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const HEADERS = { 'access-control-allow-origin': '*' }

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const baseUrl = (headers: Headers | Record<string, string>): string => {
  const objHeaders = headers instanceof Headers ? getHeaders(headers) : headers
  return `${objHeaders['x-forwarded-proto']}://${objHeaders['x-forwarded-host']}`
}

export const sendJSON = (
  data: unknown,
  { headers, ...options }: { headers?: HeadersInit } & Record<string, unknown> = {}
): Response =>
  Response.json(data, {
    headers: {
      ...HEADERS,
      ...headers
    },
    ...options
  })

export const getHeaders = (req: any): Record<string, string> => Object.fromEntries(req.headers)

export const getQuery = (req: Request): { pathname: string, searchParams: URLSearchParams } => {
  const [pathname, search] = req.url.split('?')
  return { pathname, searchParams: new URLSearchParams(search) }
}
