/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: { 50:"#e8f0fd",400:"#2a6fdb",500:"#1a5ac0",700:"#0f3375",900:"#0a2250" } } } },
  plugins: [],
};
