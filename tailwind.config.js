const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './renderer/src/components/**/*.{js,ts,jsx,tsx}',
    './renderer/src/layouts/**/*.{js,ts,jsx,tsx}',
    './renderer/src/modules/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#0068E2',
      secondary: '#151515',
      success: '#32C000',
      error: '#FF4A4A',
      white: colors.white,
      gray: colors.trueGray,
      black: colors.black,
      green: colors.green,
      yellow: colors.amber,
      red: colors.red,
    },
    extend: {
      fontSize: {
        xxs: '.70rem',
      },
    },
},
  variants: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
