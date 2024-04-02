/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      slate: {
        ...colors.slate,
        900: '#0f172a',
        950: '#020617',
      },
      highLight: '#1fcec1',
    },
    extend: {},
  },
  plugins: [],
};
