import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf2f2',
          100: '#fce4e4',
          200: '#f9c5c5',
          300: '#f49898',
          400: '#ec5d5d',
          500: '#df2d2d',
          600: '#c01c1c',
          700: '#8B1A1A',
          800: '#761616',
          900: '#5e1414',
        },
        gold: {
          400: '#d4a017',
          500: '#C4760A',
          600: '#a85e08',
        },
        cream: '#fdf8f0',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
