import type { Config } from 'tailwindcss'
import defaultConfig from 'shadcn/ui/tailwind.config'

const config = {
  ...defaultConfig,
  content: [...defaultConfig.content, './pages/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', '*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    ...defaultConfig.theme,
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      ...defaultConfig.theme.extend,
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [...defaultConfig.plugins, require('tailwindcss-animate')]
} satisfies Config

export default config
