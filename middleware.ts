/* eslint-disable @typescript-eslint/promise-function-async */

import { baseUrl, getHeaders } from '@/lib/utils'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware (req: NextRequest): Promise<Response> | NextResponse {
  const headers = getHeaders(Object.fromEntries(req.headers))
  const { accept } = headers
  if (accept.includes('text/html') || accept.includes('*/*')) return NextResponse.next()
  const url = baseUrl(headers)
  return fetch(new URL('/api', url), { headers, cache: 'no-store' })
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/'
}
