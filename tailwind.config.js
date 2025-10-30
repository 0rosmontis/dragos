/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4C6EF5',
          dark: '#364FC7',
          light: '#EDF2FF'
        }
      }
    }
  },
  plugins: []
};
