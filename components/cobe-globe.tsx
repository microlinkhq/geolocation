'use client'

import { type JSX, useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import { cn } from '@/lib/utils'

const locationToAngles = (lat: number, long: number): [number, number] => {
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180
  ]
}

export function Cobe ({
  city,
  country,
  ipAddress,
  latitude,
  longitude,
  className
}: {
  ipAddress: string
  latitude: number
  longitude: number
  city: {
    name: string
  }
  country: {
    flag: string
    name: string
  }
  className?: string
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [globeReady, setGlobeReady] = useState(false)
  const [containerWidth, setContainerWidth] = useState(400)

  // Convert latitude and longitude to phi and theta angles
  const [phi, theta] = locationToAngles(latitude, longitude)

  useEffect(() => {
    let width = 0
    let globe: any

    // Function to calculate appropriate container width based on viewport
    const calculateContainerWidth = () => {
      const viewportWidth = window.innerWidth
      // Use 33% of viewport width as suggested
      const calculatedWidth = viewportWidth * 0.33
      // Apply min/max constraints to ensure reasonable size
      return Math.max(280, Math.min(400, calculatedWidth))
    }

    const onResize = () => {
      if (containerRef.current != null && canvasRef.current != null) {
        // Calculate the appropriate container width
        const newContainerWidth = calculateContainerWidth()
        setContainerWidth(newContainerWidth)

        // Get the container width
        width = Math.min(newContainerWidth, containerRef.current.offsetWidth)

        // Set canvas dimensions
        canvasRef.current.width = width
        canvasRef.current.height = width
      }
    }

    window.addEventListener('resize', onResize)
    onResize()

    const SIZE = 1

    globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * SIZE,
      height: width * SIZE,
      phi,
      theta,
      dark: 1.1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.8,
      mapBaseBrightness: 0.05,
      baseColor: [1.1, 1.1, 1.1],
      markerColor: [251 / 255, 100 / 255, 21 / 255], // it does not matter
      glowColor: [1.1, 1.1, 1.1],
      markers: [],
      offset: [width, -width], // Use the actual width for offset
      onRender: (state: any) => {
        state.width = width * SIZE
        state.height = width * SIZE
      }
    })

    // Fade in the globe
    if (canvasRef.current != null) {
      canvasRef.current.style.opacity = '0.95'
      setGlobeReady(true)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      if (globe) globe.destroy()
    }
  }, [phi, theta, latitude, longitude])

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {/* Location information above the globe */}
      <div className='text-center mb-4 sm:mb-8'>
        <span className='block text-base sm:text-lg text-neutral-500 dark:text-neutral-400'>
          {ipAddress}
        </span>
        <h1 className='py-2 text-3xl sm:text-5xl tracking-tight font-light text-neutral-900 dark:text-white'>
          {city.name}
        </h1>
        <span className='block text-base sm:text-lg text-neutral-500 dark:text-neutral-400'>
          {country.flag} {country.name}
        </span>
      </div>

      {/* Globe container */}
      <div
        ref={containerRef}
        style={{ maxWidth: `${containerWidth}px` }}
        className={cn(
          'w-full aspect-square relative flex items-center justify-center',
          className
        )}
      >
        <canvas
          ref={canvasRef}
          className='opacity-0 transition-opacity duration-1000'
        />

        {/* Pulsing marker */}
        {globeReady && (
          <div className='absolute inset-0 pointer-events-none z-10 flex items-center justify-center'>
            <div className='marker-container relative'>
              {/* Pulsing ring */}
              <div className='absolute inset-0 rounded-full opacity-75 marker-pulse bg-[var(--marker-color)]' />
              {/* Solid center */}
              <div className='relative w-2.5 h-2.5 rounded-full bg-[var(--marker-color)]' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
