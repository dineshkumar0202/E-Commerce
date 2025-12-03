/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0058ff",
        primaryDark: "#0037a1",
        accent: "#ff9f00"
      }
    }
  },
  plugins: []
};
