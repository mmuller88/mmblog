/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#06aced',
          dark: '#0599d4',
          light: '#1ab8f0',
        },
      },
    },
  },
  plugins: [],
}
