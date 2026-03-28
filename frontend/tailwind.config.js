/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          light: '#d1fae5',   // Very light emerald
          DEFAULT: '#10b981', // Emerald 500
          dark: '#047857',    // Emerald 700
          bg: '#f8fafc',      // Slate 50 (Off-white background)
        }
      }
    },
  },
  plugins: [],
}