import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const baseUrl = (headers: Record<string, string>): string =>
  `${headers['x-forwarded-proto']}://${headers['x-forwarded-host']}`

export const sendJSON = (
  data: unknown,
  { headers, ...options }: { headers?: HeadersInit } & Record<string, unknown> = {}
): Response =>
  Response.json(data, {
    headers: {
      ...corsHeaders(),
      ...headers
    },
    ...options
  })

export const corsHeaders = (): Record<string, string> => {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  }
}

export const getHeaders = (payload: Record<string, string>): Record<string, string> => {
  if (process.env.NODE_ENV !== 'development') return payload
  return {
    'cf-region-code': 'MC',
    'x-vercel-proxy-signature-ts': '1747589156',
    'accept-encoding': 'gzip, br',
    'x-real-ip': '162.158.120.173',
    'x-vercel-proxied-for': '162.158.120.173',
    'x-vercel-id': 'cdg1::2bdmd-1747588856435-0cbce85b46b7',
    'cf-postal-code': '30009',
    'cf-ipcontinent': 'EU',
    'x-vercel-ip-timezone': 'Europe/Madrid',
    'cf-ipcountry': 'ES',
    'user-agent': 'curl/8.7.1',
    'x-vercel-ip-country': 'ES',
    'cf-connecting-ip': '88.21.1.211',
    'x-forwarded-proto': 'http',
    'x-vercel-ja4-digest': 't13d1412h2_e33ad33b3d25_6b314db333b6',
    'cdn-loop': 'cloudflare; loops=1',
    'cf-ray': '941d07304924ecaa-MAD',
    'cf-iplongitude': '-1.12130',
    'x-vercel-ip-city': 'Madrid',
    'cf-region': 'Murcia',
    'cf-timezone': 'Europe/Madrid',
    'cf-visitor': '{"scheme":"https"}',
    host: 'localhost:3000',
    'x-forwarded-for': '162.158.120.173',
    'x-vercel-ip-continent': 'EU',
    'x-vercel-ip-country-region': 'MD',
    'x-vercel-ip-longitude': '-3.694',
    accept: '*/*',
    'x-vercel-internal-bot-check': 'skip',
    'cf-ipcity': 'Murcia',
    'x-vercel-internal-ingress-bucket': 'bucket0',
    'cf-iplatitude': '37.98610',
    'x-vercel-ip-latitude': '40.4153',
    'x-forwarded-host': 'localhost:3000',
    'x-vercel-ip-postal-code': '28085',
    'x-vercel-ip-as-number': '13335',
    'x-vercel-forwarded-for': '162.158.120.173',
    'x-vercel-proxy-signature':
      'Bearer 229abd2c1dc9616beebdd8ea0c80330da13d2f18a7faa24c9a3d082c0141604e',
    connection: 'close'
  }
}

export const getQuery = (req: Request): { pathname: string, searchParams: URLSearchParams } => {
  const [pathname, search] = req.url.split('?')
  return { pathname, searchParams: new URLSearchParams(search) }
}
