/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#e8f0fd", 100: "#c8dcfa", 500: "#2a6fdb", 600: "#1a5abc", 700: "#0f4494", 800: "#0f1a2e", 900: "#0a1120" },
      },
    },
  },
  plugins: [],
};
