import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const HEADERS = { 'access-control-allow-origin': '*' }

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const baseUrl = (headers: Headers): string =>
  `${String(headers.get('x-forwarded-proto'))}://${String(headers.get('x-forwarded-host'))}`

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

export const getHeaders = (req: any): Record<string, string> => {
  return process.env.NODE_ENV !== 'development'
    ? Object.fromEntries(req.headers)
    : {
        'x-vercel-ip-continent': 'EU',
        'cf-ipcountry': 'ES',
        'cf-timezone': 'Europe/Madrid',
        'x-vercel-ip-city': 'Madrid',
        'cf-region-code': 'MC',
        'x-vercel-forwarded-for': '162.158.123.23',
        'cf-connecting-ip': '104.28.197.62',
        'cf-iplatitude': '37.98610',
        'x-vercel-ja4-digest': 't13d1412h2_e33ad33b3d25_6b314db333b6',
        'x-vercel-ip-timezone': 'Europe/Madrid',
        host: 'geolocation.microlink.io',
        'cf-postal-code': '30001',
        'cf-ipcontinent': 'EU',
        'x-vercel-ip-postal-code': '28085',
        'cf-ray': '93f90c03cb630270-MAD',
        'x-vercel-ip-country': 'ES',
        'x-vercel-ip-country-region': 'MD',
        'x-vercel-proxy-signature':
      'Bearer 9fea86f00b223dfe1ff6703f599666cf1e33a4c5b0d0248f6eadfa97aa77e944',
        'cdn-loop': 'cloudflare; loops=1',
        'x-vercel-proxied-for': '162.158.123.23',
        'cf-region': 'Murcia',
        'x-vercel-internal-bot-check': 'skip',
        accept: '*/*',
        'x-forwarded-host': 'geolocation.microlink.io',
        'x-vercel-proxy-signature-ts': '1747211866',
        'x-vercel-internal-ingress-bucket': 'bucket0',
        forwarded:
      'for=162.158.123.23;host=geolocation.microlink.io;proto=https;sig=0QmVhcmVyIDlmZWE4NmYwMGIyMjNkZmUxZmY2NzAzZjU5OTY2NmNmMWUzM2E0YzViMGQwMjQ4ZjZlYWRmYTk3YWE3N2U5NDQ=;exp=1747211866',
        'x-forwarded-for': '162.158.123.23',
        'x-forwarded-proto': 'https',
        'x-vercel-deployment-url': 'geolocation-3cdl82fjs-microlink.vercel.app',
        'x-vercel-ip-latitude': '40.4153',
        'cf-iplongitude': '-1.12130',
        'x-vercel-ip-longitude': '-3.694',
        'accept-encoding': 'gzip, br',
        'user-agent': 'curl/8.7.1',
        'cf-visitor': '{"scheme":"https"}',
        'x-real-ip': '162.158.123.23',
        'cf-ipcity': 'Murcia',
        'x-vercel-ip-as-number': '13335',
        'x-vercel-id': 'cdg1::5j6x4-1747211566709-f447aeed0cca',
        connection: 'close'
      }
}

export const getQuery = (req: Request): { pathname: string, searchParams: URLSearchParams } => {
  const [pathname, search] = req.url.split('?')
  return { pathname, searchParams: new URLSearchParams(search) }
}
