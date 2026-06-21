/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981', // Emerald green for eco-friendly theme
        secondary: '#3B82F6', // Blue for trust
        dark: '#1F2937',
        light: '#F3F4F6'
      }
    },
  },
  plugins: [],
}
