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
        surface: {
          DEFAULT: '#c8b896',       // warm tan — main bg
          secondary: '#b8a682',     // deeper tan — section bg
          tertiary: '#d4c6a8',      // lighter tan
        },
        ink: {
          DEFAULT: '#ffffff',              // white — primary text
          secondary: 'rgba(255,255,255,0.78)',
          tertiary: 'rgba(255,255,255,0.55)',
          faint: 'rgba(255,255,255,0.25)',
        },
        accent: {
          DEFAULT: '#4a6741',       // forest green — buttons, accents
          muted: '#5c7a52',         // lighter green
          subtle: '#3d5a35',        // darker green
        },
        eden: {
          50: '#d4c6a8',
          100: '#c8b896',
          200: '#b8a682',
          300: '#a89470',
          400: '#98845e',
          500: '#4a6741',
          600: '#3d5a35',
          700: '#2f4a28',
          800: '#223a1c',
          900: '#152b11',
        },
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '600' }],
        'display-sm': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '600' }],
        'heading': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '600' }],
        'subheading': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '500' }],
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
        'pulse-ink': 'pulseInk 4s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'expand': 'expand 1.5s ease-out forwards',
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
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        breatheGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        pulseInk: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
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
      },
    },
  },
  plugins: [],
};
