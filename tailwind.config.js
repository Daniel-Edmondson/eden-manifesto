/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#c8b978',
          light: '#e8d5a3',
          dark: '#a09060',
          muted: 'rgba(200, 185, 140, 0.3)',
        },
        cream: '#f5f0e8',
        eden: {
          dark: '#0a0a0a',
          soft: '#141414',
          mid: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
