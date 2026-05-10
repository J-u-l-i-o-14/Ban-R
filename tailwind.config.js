/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'rb-blue': '#4e7a96',
        'rb-dark': '#1a2e3a',
      },
    },
  },
  plugins: [],
}

