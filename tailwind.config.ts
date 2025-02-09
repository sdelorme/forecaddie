import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* masters base green*/
        primary: '#006747',
        /* masters yellow*/
        secondary: '#fce300',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Override the default "sans" with Poppins
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
  safelist: [
    'bg-green-500',
    'bg-gray-400',
    'bg-red-500',
    'bg-red-600', // Fallback
  ],
}
export default config
