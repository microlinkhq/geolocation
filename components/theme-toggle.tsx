import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ThemeToggle ({ size = 'default' }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant='ghost' size={size} className='h-7 w-7 p-0 rounded-full bg-transparent'>
        <span className='sr-only'>Toggle theme</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    const currentTheme = resolvedTheme || theme
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant='ghost'
      size={size}
      onClick={toggleTheme}
      className='h-7 w-7 p-0 rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
    >
      <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-neutral-700' />
      <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-neutral-400' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}
