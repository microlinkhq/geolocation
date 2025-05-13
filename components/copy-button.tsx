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
            className='rounded-full h-7 w-7 bg-white/80 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800/50 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
          >
            {copied
              ? (
                <ClipboardCheck className='h-3.5 w-3.5 text-green-500' />
                )
              : (
                <Clipboard className='h-3.5 w-3.5 text-gray-500 dark:text-zinc-400' />
                )}
            <span className='sr-only'>Copy to clipboard</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side='left'
          className='bg-white dark:bg-zinc-900/90 border-gray-200 dark:border-zinc-800/50 text-xs'
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
