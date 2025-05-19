import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

const PROTOCOL = process.env.NODE_ENV === 'production' ? 'https' : 'http'

export const baseUrl = (headers: Record<string, string>): string => `${PROTOCOL}://${headers.host}`

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
    'accept-encoding': 'gzip, deflate, br, zstd',
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
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
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

// Function to generate error report email with headers
export function generateErrorReport (error: string): string {
  // Collect browser and environment information
  const browserInfo = {
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    platform: window.navigator.platform,
    vendor: window.navigator.vendor,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    windowSize: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer ?? 'N/A'
  }

  // Format the email body
  const emailBody = `Hello, Microlink team

I encountered an error while using the geolocation service:

Error: ${error}

Browser Information:

- User Agent: ${browserInfo.userAgent}
- Language: ${browserInfo.language}
- Platform: ${browserInfo.platform}
- Vendor: ${browserInfo.vendor}
- Screen Size: ${browserInfo.screenSize}
- Window Size: ${browserInfo.windowSize}
- Pixel Ratio: ${browserInfo.pixelRatio}
- Timezone: ${browserInfo.timezone}
- URL: ${browserInfo.url}
- Referrer: ${browserInfo.referrer}
- Timestamp: ${browserInfo.timestamp}

Please let me know if you need any additional information.

Thank you.`

  // Encode the email body for mailto link
  return encodeURIComponent(emailBody)
}
