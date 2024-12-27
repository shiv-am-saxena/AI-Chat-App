/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        pristina: ["Pristina", "sans-serif"],
      },
      boxShadow: {
        neumorph: `20px 20px 60px #2f3745, -20px -20px 60px #3f4b5d`,
      }
    },
  },
  plugins: [],
}

