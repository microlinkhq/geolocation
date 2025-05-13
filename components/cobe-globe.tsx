'use client'

import type React from 'react'

import { type JSX, useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const locationToAngles = (lat: number, long: number): [number, number] => {
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180
  ]
}

// Separate component for clickable location info
function LocationInfo ({
  ipAddress,
  city,
  country
}: {
  ipAddress: string
  city: { name: string }
  country: { flag: string; name: string }
}) {
  const [activeElement, setActiveElement] = useState<string | null>(null)
  const { toast } = useToast()

  // Generic copy function
  const copyToClipboard = async (text: string, description: string) => {
    try {
      await navigator.clipboard.writeText(text)

      // Show visual feedback
      setActiveElement(description.toLowerCase())
      setTimeout(() => setActiveElement(null), 300)

      // Show toast notification
      toast({
        title: `${description} copied to clipboard`,
        description: `The ${description.toLowerCase()} has been copied to your clipboard.`,
        duration: 2000
      })
    } catch (err) {
      console.error(`Failed to copy ${description.toLowerCase()}: `, err)

      // Show error toast
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    }
  }

  // Copy handlers for individual elements
  const copyIpAddress = async () => copyToClipboard(ipAddress, 'IP address')
  const copyCity = async () => copyToClipboard(city.name, 'City')
  const copyCountry = async () => copyToClipboard(country.name, 'Country')

  return (
    <div className='text-center mb-4 sm:mb-8'>
      <span
        className={cn(
          'block text-base sm:text-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors clickable-element',
          activeElement === 'ip address' &&
            'text-neutral-800 dark:text-neutral-200'
        )}
        onClick={copyIpAddress}
        onKeyDown={async e => e.key === 'Enter' && copyIpAddress()}
        tabIndex={0}
        role='button'
        aria-label={`IP address: ${ipAddress}. Click to copy.`}
      >
        {ipAddress}
      </span>
      <h1
        className={cn(
          'py-2 text-3xl sm:text-5xl tracking-tight font-light text-neutral-900 dark:text-white hover:text-black dark:hover:text-neutral-100 transition-colors clickable-element',
          activeElement === 'city' && 'text-black dark:text-white'
        )}
        onClick={copyCity}
        onKeyDown={async e => e.key === 'Enter' && copyCity()}
        tabIndex={0}
        role='button'
        aria-label={`City: ${city.name}. Click to copy.`}
      >
        {city.name}
      </h1>
      <span
        className={cn(
          'block text-base sm:text-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors clickable-element',
          activeElement === 'country' &&
            'text-neutral-800 dark:text-neutral-200'
        )}
        onClick={copyCountry}
        onKeyDown={async e => e.key === 'Enter' && copyCountry()}
        tabIndex={0}
        role='button'
        aria-label={`Country: ${country.name}. Click to copy.`}
      >
        {country.flag} {country.name}
      </span>
    </div>
  )
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
  const [isActive, setIsActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { toast } = useToast()

  // Convert latitude and longitude to phi and theta angles
  const [phi, theta] = locationToAngles(latitude, longitude)

  // Function to copy full location data to clipboard
  const copyLocationData = async () => {
    const locationData = {
      ip: ipAddress,
      city: city.name,
      country: country.name,
      coordinates: {
        latitude,
        longitude
      }
    }

    const formattedData = JSON.stringify(locationData, null, 2)

    try {
      await navigator.clipboard.writeText(formattedData)

      // Show visual feedback
      setIsActive(true)
      setTimeout(() => setIsActive(false), 300)

      // Show toast notification
      toast({
        title: 'Location copied to clipboard',
        description: 'The location data has been copied to your clipboard.',
        duration: 2000
      })
    } catch (err) {
      console.error('Failed to copy location data: ', err)

      // Show error toast
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    }
  }

  // Function to check if mouse is within the circular globe area
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current == null) return

    // Get container dimensions and position
    const rect = containerRef.current.getBoundingClientRect()

    // Calculate center of the container
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate mouse position relative to the container
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    )

    // Check if mouse is within the circular area (radius is half the width)
    const radius = rect.width / 2
    setIsHovering(distanceFromCenter <= radius)

    // Dynamically set cursor style based on whether mouse is over the globe
    if (containerRef.current) {
      containerRef.current.style.cursor =
        distanceFromCenter <= radius ? 'copy' : 'default'
    }
  }

  // Handle mouse leave to ensure hover state is reset
  const handleMouseLeave = () => {
    setIsHovering(false)
    // Reset cursor when leaving the container
    if (containerRef.current != null) {
      containerRef.current.style.cursor = 'default'
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current == null) return

    // Get container dimensions and position
    const rect = containerRef.current.getBoundingClientRect()

    // Calculate center of the container
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate click position relative to the container
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Calculate distance from center
    const distanceFromCenter = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
    )

    // Check if click is within the circular area (radius is half the width)
    const radius = rect.width / 2
    if (distanceFromCenter <= radius) {
      copyLocationData()
    }
  }

  useEffect(() => {
    let width = 0
    let globe: any

    // Function to calculate appropriate container width based on viewport
    const calculateContainerWidth = () => {
      const viewportWidth = window.innerWidth
      // For mobile, use a larger percentage of viewport width
      const percentage = viewportWidth < 768 ? 0.8 : 0.33
      const calculatedWidth = viewportWidth * percentage
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
      {/* Location information above the globe - now in a separate component */}
      <LocationInfo ipAddress={ipAddress} city={city} country={country} />

      {/* Globe container */}
      <div
        ref={containerRef}
        style={{ maxWidth: `${containerWidth}px` }}
        className={cn(
          'w-full aspect-square relative flex items-center justify-center',
          isActive
            ? 'scale-[0.98] transition-transform duration-150'
            : 'transition-transform duration-150',
          className
        )}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role='button'
        tabIndex={0}
        aria-label='Globe showing location. Click to copy location data.'
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            copyLocationData()
          }
        }}
      >
        {/* Canvas element */}
        <canvas
          ref={canvasRef}
          className='opacity-0 transition-opacity duration-1000'
        />

        {/* Click hint overlay - only visible when hovering over the circular area */}
        {isHovering && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full transition-opacity duration-200 pointer-events-none'>
            <span className='text-xs font-medium text-white dark:text-white bg-black/50 dark:bg-black/70 px-2 py-1 rounded'>
              Click to copy location
            </span>
          </div>
        )}

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
