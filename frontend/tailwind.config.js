/** @type {import('tailwindcss').Config} */
module.exports = {
  // ✅ TAMBAHKAN INI untuk enable dark mode dengan class
  darkMode: 'class',
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'persebaya-green': '#00a651',
        'persebaya-dark': '#006b3f',
      }
    },
  },
  plugins: [],
}