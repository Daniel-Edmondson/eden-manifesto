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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      colors: {
        eden: {
          50: '#f5f0e8',   // warm cream
          100: '#e8dfd2',  // light parchment
          200: '#c9b99a',  // warm sand
          300: '#a89570',  // muted gold
          400: '#8a7656',  // deep sand
          500: '#6b5a3e',  // warm brown
          600: '#4a3d2a',  // dark earth
          700: '#1a1510',  // near-black warm
          800: '#110e0a',  // deep dark
          900: '#0a0806',  // void
          950: '#050403',  // absolute dark
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#e4c85c',
          bright: '#ffd700',
          muted: '#a8892a',
          dark: '#8b6914',
          glow: '#c9a22740',
        },
        midnight: {
          DEFAULT: '#0d1117',
          light: '#161b22',
          dark: '#080b0f',
          blue: '#0d1b2a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          light: '#faf8f4',
          dark: '#e8dfd2',
          muted: '#c9b99a',
        },
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-sm': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'heading': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'subheading': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-up': 'slideUp 1s ease-out forwards',
        'draw': 'draw 3s ease-out forwards',
        'breathe': 'breathe 6s ease-in-out infinite',
        'breathe-glow': 'breatheGlow 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'spin-reverse': 'spinReverse 45s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'expand': 'expand 1.5s ease-out forwards',
        'triad-pulse': 'triadPulse 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        draw: {
          from: { strokeDashoffset: '628' },
          to: { strokeDashoffset: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
        breatheGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.2))', opacity: '0.6' },
          '50%': { filter: 'drop-shadow(0 0 24px rgba(201, 162, 39, 0.5))', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.5', filter: 'drop-shadow(0 0 4px rgba(201, 162, 39, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(201, 162, 39, 0.6))' },
        },
        spinReverse: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        expand: {
          from: { transform: 'scale(0.8)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        triadPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '33%': { transform: 'scale(1.15)' },
          '66%': { transform: 'scale(0.95)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
