import { useState } from 'react'
import { Check, ChevronDown, ClipboardCopy, Terminal, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

const API_URL = 'https://geolocation.microlink.io/'

export function CopyAsDropdown ({ jsonData }: { jsonData: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const { toast } = useToast()

  const generateCurl = () => {
    return `curl -X GET "${API_URL}"`
  }

  const generateFetch = () => {
    return `fetch("${API_URL}")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)

      // Show toast notification
      toast({
        title: `Copied as ${type}`,
        description: `The ${type} command has been copied to your clipboard.`,
        duration: 2000
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(null)
      }, 2000)
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
          onClick={async () => await copyToClipboard(jsonData, 'JSON')}
        >
          <Copy className='h-4 w-4 opacity-70' />
          <span>as JSON</span>
          {copied === 'JSON' && <Check className='h-4 w-4 ml-auto text-green-500' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 focus:text-neutral-900 dark:focus:text-white focus:bg-neutral-100 dark:focus:bg-neutral-800'
          onClick={async () => await copyToClipboard(generateCurl(), 'cURL')}
        >
          <Terminal className='h-4 w-4 opacity-70' />
          <span>as cURL</span>
          {copied === 'cURL' && <Check className='h-4 w-4 ml-auto text-green-500' />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-2 text-neutral-600 dark:text-neutral-400 focus:text-neutral-900 dark:focus:text-white focus:bg-neutral-100 dark:focus:bg-neutral-800'
          onClick={async () => await copyToClipboard(generateFetch(), 'fetch')}
        >
          <ClipboardCopy className='h-4 w-4 opacity-70' />
          <span>as fetch</span>
          {copied === 'fetch' && <Check className='h-4 w-4 ml-auto text-green-500' />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
