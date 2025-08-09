/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-mist': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac', // --color-green-light
          400: '#4ade80', // --color-green-accent  
          500: '#22c55e', // --color-green-primary
          600: '#16a34a', // --color-green-secondary
          700: '#15803d', // --color-green-dark
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        'green-mist': ['var(--font-primary)'],
      },
      backgroundImage: {
        'green-mist-gradient': 'var(--bg-primary)',
        'glass': 'var(--bg-card)',
      }
    },
  },
  plugins: [],
}