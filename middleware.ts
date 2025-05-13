import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware (request: NextRequest): Promise<NextResponse> {
  // Check if the request accepts HTML
  const acceptHeader = request.headers.get('accept')
  const acceptsHtml = typeof acceptHeader === 'string' && acceptHeader.includes('text/html')

  // If the client doesn't accept HTML, return JSON data
  if (!acceptsHtml) {
    try {
      // Fetch the geolocation data
      const res = await fetch('https://geolocation.microlink.io/')
      const data = await res.json()

      // Return the data as JSON
      return NextResponse.json(data)
    } catch (error) {
      // Handle errors
      return NextResponse.json(
        { error: 'Failed to fetch geolocation data' },
        { status: 500 }
      )
    }
  }

  // If the client accepts HTML, continue to the normal page rendering
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: '/'
}
