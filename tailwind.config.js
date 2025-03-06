/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a56db',
        secondary: '#7e22ce',
        accent: '#f59e0b',
      },
    },
  },
  plugins: [],
} 