'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface JsonDisplayProps {
  jsonData: string
}

export function JsonDisplay ({ jsonData }: JsonDisplayProps) {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(jsonData)

      // Show visual feedback
      setIsActive(true)
      setTimeout(() => setIsActive(false), 300)

      // Show toast notification
      toast({
        title: 'JSON copied to clipboard',
        description: 'The JSON data has been copied to your clipboard.',
        duration: 2000
      })
    } catch (err) {
      console.error('Failed to copy text: ', err)

      // Show error toast
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive',
        duration: 3000
      })
    }
  }

  return (
    <pre
      onClick={handleClick}
      className={`p-4 rounded-md overflow-auto text-xs text-neutral-700 dark:text-neutral-400 font-mono flex-1 border border-neutral-200 dark:border-neutral-900 min-h-[200px] md:min-h-0 cursor-pointer transition-colors duration-150 select-all hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
        isActive ? 'bg-neutral-100 dark:bg-neutral-800' : ''
      }`}
      aria-label='JSON data, click to copy to clipboard'
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      {jsonData}
    </pre>
  )
}
