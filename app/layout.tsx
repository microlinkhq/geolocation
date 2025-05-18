import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import type React from 'react'
import { Inter } from 'next/font/google'

import './globals.css'

// Load Inter font with specific weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Microlink Geolocation',
  description: 'Get detailed information about the incoming request based on the IP address.'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning className={inter.variable}>
      <body className='font-sans antialiased'>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
