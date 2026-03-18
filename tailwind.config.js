/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050507',
          900: '#0A0A0F',
          800: '#0F0F17',
          700: '#14141F',
          600: '#1A1A27',
          500: '#22222F',
          400: '#2A2A3A',
        },
        glass: {
          border: 'rgba(255,255,255,0.06)',
          'border-hover': 'rgba(255,255,255,0.12)',
          surface: 'rgba(255,255,255,0.03)',
          'surface-hover': 'rgba(255,255,255,0.06)',
        },
        accent: {
          blue:   '#3B82F6',
          green:  '#10B981',
          amber:  '#F59E0B',
          purple: '#8B5CF6',
          teal:   '#14B8A6',
          red:    '#EF4444',
          indigo: '#6366F1',
        },
        muted: '#A3A3A3',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'border-beam': 'borderBeam 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        borderBeam: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
