'use client'

import { useState } from 'react'
import { Check, ChevronDown, ClipboardCopy, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function CopyAsDropdown ({ apiUrl }: { apiUrl: string }) {
  const [copied, setCopied] = useState<string | null>(null)

  const generateCurl = () => {
    return `curl -X GET "${apiUrl}"`
  }

  const generateFetch = () => {
    return `fetch("${apiUrl}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(null)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='text-neutral-600 dark:text-neutral-400 text-xs font-light border-neutral-200 dark:border-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'
        >
          Copy as <ChevronDown className='ml-1 h-4 w-4 opacity-70' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-900'
      >
        <DropdownMenuItem
          className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 focus:text-neutral-900 dark:focus:text-white focus:bg-neutral-100 dark:focus:bg-neutral-800'
          onClick={async () => await copyToClipboard(generateCurl(), 'curl')}
        >
          <Terminal className='h-4 w-4 opacity-70' />
          <span>as cURL</span>
          {copied === 'curl' && (
            <Check className='h-4 w-4 ml-auto text-green-500' />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 focus:text-neutral-900 dark:focus:text-white focus:bg-neutral-100 dark:focus:bg-neutral-800'
          onClick={async () => await copyToClipboard(generateFetch(), 'fetch')}
        >
          <ClipboardCopy className='h-4 w-4 opacity-70' />
          <span>as fetch</span>
          {copied === 'fetch' && (
            <Check className='h-4 w-4 ml-auto text-green-500' />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
