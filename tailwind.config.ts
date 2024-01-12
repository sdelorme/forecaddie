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
    },
  },
  plugins: [],
}
export default config
