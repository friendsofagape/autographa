/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './renderer/src/components/**/*.{js,ts,jsx,tsx}',
    './renderer/src/layouts/**/*.{js,ts,jsx,tsx}',
    './renderer/src/core/**/*.{js,ts,jsx,tsx}',
    './renderer/src/modules/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#0073E5',
      secondary: '#151515',
      success: '#40C000',
      error: '#FF4D4D',
      validation: '#FFE5E5',
      white: colors.white,
      light: '#E4F1FF',
      gray: colors.neutral,
      dark: '#333333',
      black: colors.black,
      green: colors.emerald,
      yellow: colors.amber,
      red: colors.red,
    },
    extend: {
      fontSize: {
        xxs: '.65rem',
      },
      height: {
        editor: 'calc(-9rem + 100vh)',
        'audio-editor': 'calc(-6.5rem + 100vh)',
      },
    },
  },
  // variants: {
  //   extend: {
  //     display: ['group-hover'],
  //   },
  //   width: ['first', 'last'],
  //   fontFamily: {
  //     sans: ['Graphik', 'sans-serif'],
  //     serif: ['Merriweather', 'serif'],
  //   },
  // },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
