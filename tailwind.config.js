const { join } = require('path');

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example primary color
        secondary: '#FBBF24', // Example secondary color
      },
      spacing: {
        // Custom spacing values if required
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Example font family
      },
    },
  },
  plugins: [],
};