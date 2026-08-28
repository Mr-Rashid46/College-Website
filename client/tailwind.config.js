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
          50: '#f0f4f9',
          100: '#dbe5f2',
          200: '#b9d0e6',
          300: '#8bb1d5',
          400: '#588cc1',
          500: '#356ea9',
          600: '#25558d',
          700: '#1d4372',
          800: '#0f2b5c', // Primary Academic Deep Navy
          900: '#0a1a39',
          950: '#061025',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde2e2',
          500: '#9b1c1c',
          600: '#800020', // Burgundy Maroon
          700: '#6b001a',
          800: '#540014',
          900: '#3d000f',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37', // Academic Gold accent
          600: '#b48c23',
          700: '#8d6817',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        academic: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 43, 92, 0.08)',
        card: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.02)',
        glow: '0 0 25px rgba(212, 175, 55, 0.35)',
      },
    },
  },
  plugins: [],
}
