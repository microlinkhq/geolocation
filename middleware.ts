/* eslint-disable @typescript-eslint/promise-function-async */

import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { baseUrl } from '@/lib/utils'

export function middleware (request: NextRequest): Promise<Response> | NextResponse {
  const acceptHeader = request.headers.get('accept')
  const acceptsHtml = typeof acceptHeader === 'string' && acceptHeader.includes('text/html')

  if (acceptsHtml) return NextResponse.next()

  const url = baseUrl(request.headers)
  return fetch(new URL('/api', url))
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/'
}
