'use client'

/* eslint-disable @typescript-eslint/promise-function-async */

import { CopyAsDropdown } from '@/components/copy-as-dropdown'
import { JsonDisplay } from '@/components/json-display'
import { ThemeToggle } from '@/components/theme-toggle'
import { JSX, useEffect, useState } from 'react'
import { generateErrorReport } from '@/lib/utils'
import { GithubIcon, Mail } from 'lucide-react'
import { Cobe } from '@/components/cobe-globe'

export const dynamic = 'force-dynamic'

export default function Home (): JSX.Element | null {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [jsonData, setJsonData] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const endpoint = `${window.location.origin}/api`
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`API request failed with status ${res.status}`)
        const responseData = await res.json()
        setData(responseData)
        setJsonData(JSON.stringify(responseData, null, 2))
      } catch (err) {
        console.error('Error fetching geolocation data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return null

  if (error || !data) {
    const errorReport = error
      ? generateErrorReport(error)
      : generateErrorReport('Unknown error occurred')

    return (
      <div className='flex items-center justify-center min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white'>
        <div className='text-center p-8 max-w-md'>
          <h1 className='text-2xl font-light mb-4'>Unable to load geolocation data</h1>
          <p className='text-neutral-500 dark:text-neutral-500 mb-6'>
            {error || 'Please try again later.'}
          </p>

          <a
            href={`mailto:hello@microlink.io?subject=Geolocation%20API%20Error%20Report&body=${errorReport}`}
            className='inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mb-6'
          >
            <Mail className='h-4 w-4' />
            Report Issue
          </a>
        </div>
      </div>
    )
  }

  // Ensure coordinates are properly parsed as numbers
  const latitude = Number.parseFloat(data.coordinates?.latitude) || 0
  const longitude = Number.parseFloat(data.coordinates?.longitude) || 0

  return (
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
            <CopyAsDropdown jsonData={jsonData} />

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
            API Response <span className='normal-case text-[10px] opacity-70'>(click to copy)</span>
          </div>

          {/* JSON display with click-to-copy functionality */}
          <div className='flex-1 overflow-hidden flex flex-col relative'>
            <JsonDisplay jsonData={jsonData} />
          </div>
        </div>
      </div>
    </main>
  )
}
