/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translate3d(100%, 0, 0) scale(1)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
        },
        'slide-right': {
          '0%': { transform: 'translate3d(-100%, 0, 0) scale(1)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
        },
        'close-to-bottom-right': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate3d(50%, 25%, 0) scale(0.3)', opacity: '0' }
        },
        'close-to-top-right': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate3d(50%, -25%, 0) scale(0.3)', opacity: '0' }
        },
        'close-to-center-right': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate3d(50%, 0, 0) scale(0.3)', opacity: '0' }
        },
        'slide-next': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate3d(-30%, 0, 0) scale(0.95)', opacity: '0' }
        },
        'slide-prev': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate3d(30%, 0, 0) scale(0.95)', opacity: '0' }
        },
        'slide-in-next': {
          '0%': { transform: 'translate3d(30%, 0, 0) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
        },
        'slide-in-prev': {
          '0%': { transform: 'translate3d(-30%, 0, 0) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'slide-left': 'slide-left 0.3s ease-in-out forwards',
        'slide-right': 'slide-right 0.3s ease-in-out forwards',
        'close-to-bottom-right': 'close-to-bottom-right 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'close-to-top-right': 'close-to-top-right 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'close-to-center-right': 'close-to-center-right 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-next': 'slide-next 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-prev': 'slide-prev 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-next': 'slide-in-next 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-prev': 'slide-in-prev 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
} 