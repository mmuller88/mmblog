/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#06aced",
          dark: "#0599d4",
          light: "#1ab8f0",
          // White label on #06aced is ~2.6:1. solid passes AA (~5.9:1).
          solid: "#0369a1",
          solidHover: "#075985",
        },
      },
    },
  },
}
