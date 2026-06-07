/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
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
