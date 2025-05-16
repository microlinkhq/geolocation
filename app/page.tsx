/* eslint-disable @typescript-eslint/promise-function-async */

import { CopyAsDropdown } from '@/components/copy-as-dropdown'
import { ThemeProvider } from '@/components/theme-provider'
import { JsonDisplay } from '@/components/json-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { Cobe } from '@/components/cobe-globe'
import { GithubIcon } from 'lucide-react'
import { baseUrl } from '@/lib/utils'
import { headers } from 'next/headers'
import { JSX } from 'react'

export const dynamic = 'force-dynamic'

export default async function Home (): Promise<JSX.Element> {
  const url = baseUrl(await headers())
  const data = await fetch(new URL('/api', url)).then(res => res.json())
  console.log(data)

  // Ensure coordinates are properly parsed as numbers
  const latitude = Number.parseFloat(data.coordinates?.latitude) || 0
  const longitude = Number.parseFloat(data.coordinates?.longitude) || 0

  // Format the JSON data for display and copying
  const jsonData = JSON.stringify(data, null, 2)
  const apiUrl = 'https://geolocation.microlink.io/'

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange={false}
    >
      <main className='relative min-h-screen overflow-x-hidden bg-white dark:bg-black flex flex-col'>
        {/* Globe section */}
        <div className='w-full min-h-[70vh] md:min-h-0 md:h-screen md:w-[65%] flex flex-col'>
          <div className='flex-1 flex items-center justify-center w-full px-4 py-8 md:py-0 md:px-8'>
            <Cobe
              ipAddress={data.ip?.address || 'Unknown IP'}
              country={{
                flag: data.country?.flag || '🌍',
                name: data.country?.name || 'Unknown Country'
              }}
              city={{
                name: data.city?.name || 'Unknown City'
              }}
              latitude={latitude}
              longitude={longitude}
            />
          </div>

          {/* Feature highlights section */}
          <div className='w-full border-t border-neutral-200 dark:border-neutral-900 py-8 md:py-12 px-4 md:px-12 hidden md:block'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 max-w-4xl mx-auto'>
              <div className='flex flex-col'>
                <h3 className='text-2xl md:text-3xl font-light text-neutral-900 dark:text-white mb-2'>
                  Simple
                </h3>
                <p className='text-neutral-500 dark:text-neutral-500 text-sm'>
                  Just one HTTP request
                </p>
              </div>
              <div className='flex flex-col'>
                <h3 className='text-2xl md:text-3xl font-light text-neutral-900 dark:text-white mb-2'>
                  Fast
                </h3>
                <p className='text-neutral-500 dark:text-neutral-500 text-sm'>
                  Low latency responses
                </p>
              </div>
              <div className='flex flex-col'>
                <h3 className='text-2xl md:text-3xl font-light text-neutral-900 dark:text-white mb-2'>
                  Free
                </h3>
                <p className='text-neutral-500 dark:text-neutral-500 text-sm'>No API key needed</p>
              </div>
            </div>
          </div>
        </div>

        {/* API response section - stacked on mobile, sidebar on desktop */}
        <div className='w-full md:fixed md:top-0 md:right-0 md:bottom-0 md:w-[35%] z-10 flex flex-col md:h-screen border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-900 md:transform md:translate-x-0 transition-transform'>
          {/* Header section */}
          <div className='p-6 border-b border-neutral-200 dark:border-neutral-900'>
            <h2 className='text-xl font-light text-neutral-900 dark:text-white mb-2'>
              IP-based location data, simplified
            </h2>
            <p className='text-sm text-neutral-500 dark:text-neutral-500 mb-6 font-light'>
              Get detailed information about the incoming request based on the IP address.
            </p>

            {/* Dropdown and GitHub link row */}
            <div className='flex items-center justify-between'>
              <CopyAsDropdown apiUrl={apiUrl} jsonData={jsonData} />

              <div className='flex items-center gap-3'>
                <a
                  href='https://github.com/microlinkhq/geolocation'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors'
                >
                  <GithubIcon className='h-4 w-4' />
                  <span className='hidden sm:inline'>View on GitHub</span>
                </a>

                <ThemeToggle size='sm' />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className='flex-1 flex flex-col overflow-hidden p-6'>
            <div className='text-xs text-neutral-500 dark:text-neutral-500 mb-3 uppercase tracking-wider font-light'>
              API Response{' '}
              <span className='normal-case text-[10px] opacity-70'>(click to copy)</span>
            </div>

            {/* JSON display with click-to-copy functionality */}
            <div className='flex-1 overflow-hidden flex flex-col relative'>
              <JsonDisplay jsonData={jsonData} />
            </div>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </main>
    </ThemeProvider>
  )
}
