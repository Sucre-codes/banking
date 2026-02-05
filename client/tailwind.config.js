/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        boared: {
          50: '#fff1f2',
          500: '#dc2626',
          700: '#b91c1c'
        },
        bonavy: {
          500: '#0f172a',
          700: '#0b1120'
        },
        bocream: {
          100: '#fef9ef',
          200: '#f9f0dd'
        }
      }
    }
  },
  plugins: []
};