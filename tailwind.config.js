/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00c9a7',
          dark: '#009b81'
        }
      }
    }
  },
  plugins: []
};
