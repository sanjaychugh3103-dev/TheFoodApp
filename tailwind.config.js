/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#059669", // Emerald 600
        secondary: "#10b981", // Emerald 500
        accent: "#f59e0b", // Amber 500
        background: "#f9fafb", // Gray 50
      },
    },
  },
  plugins: [],
}
