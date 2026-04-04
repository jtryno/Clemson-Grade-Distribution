/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clemson: {
          orange: '#F66733',
          purple: '#522D80',
        },
      },
    },
  },
  plugins: [],
}

