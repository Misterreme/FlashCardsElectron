/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Esto es importante: usa 'class' en lugar de 'media'
  theme: {
    extend: {},
  },
  plugins: [],
}
