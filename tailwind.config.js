/* eslint-disable global-require */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  variants: {},
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      fontFamily: {
        sans: ['raleway', ...defaultTheme.fontFamily.sans],
      },
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        tertiary: 'var(--bg-tertiary)',
        quaternary: 'var(--bg-quaternary)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
      },
      borderColor: {
        secondary: 'var(--text-secondary)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
