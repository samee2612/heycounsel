/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
          600: '#476282',
        },
        gold: {
          400: '#F4D06F',
          500: '#E0B038',
          600: '#C79824',
        },
        teal: {
          500: '#48BFE3',
          600: '#0096C7',
        }
      }
    },
  },
  plugins: [],
};
