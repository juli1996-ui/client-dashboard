/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0f1020',
          900: '#1a1a2e',
          800: '#16213e',
          700: '#1e2a4a',
          600: '#2a2d4a',
          500: '#353d60',
        },
        accent: {
          blue:   '#4a90d9',
          green:  '#2ecc71',
          amber:  '#fbbf24',
          purple: '#a78bfa',
          teal:   '#2dd4bf',
          red:    '#f87171',
        },
        muted: '#a0a8b8',
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '16px',
      },
    },
  },
  plugins: [],
}
