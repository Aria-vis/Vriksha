/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1B4D3E',
          'green-light': '#2D6A4F',
          'green-dark': '#081C15',
          saffron: '#E67E22',
          'saffron-light': '#F39C12',
          'saffron-dark': '#C0392B',
          earth: '#C85A32',
          'earth-light': '#D97746',
          'earth-dark': '#8E2800',
          cream: '#FDFBF7',
          sand: '#F4F0E8',
        },
        freshness: {
          verified: '#10B981',
          recheck: '#F59E0B',
          possiblyGone: '#EF4444',
          reportedGone: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius, 0.75rem)',
        md: 'calc(var(--radius, 0.75rem) - 2px)',
        sm: 'calc(var(--radius, 0.75rem) - 4px)',
      }
    },
  },
  plugins: [],
}
