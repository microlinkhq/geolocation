import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'

// Load Inter font with specific weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Microlink Geolocation',
  description:
    'Get detailed information about the incoming request based on the IP address.'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang='en' suppressHydrationWarning className={inter.variable}>
      <body className='font-sans antialiased'>{children}</body>
    </html>
  )
}
