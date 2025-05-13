'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Clipboard, ClipboardCheck } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export function CopyButton ({ textToCopy }: { textToCopy: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleCopy}
            className='rounded-full h-7 w-7 bg-white/80 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
          >
            {copied
              ? (
                <ClipboardCheck className='h-3.5 w-3.5 text-green-500' />
                )
              : (
                <Clipboard className='h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400' />
                )}
            <span className='sr-only'>Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side='left'
          className='bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-900 text-xs'
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
