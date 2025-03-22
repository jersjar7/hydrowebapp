
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#84C2FF',
          400: '#5BADFF',
          500: '#3299FF',
          600: '#007AFF',
          700: '#0062CC',
          800: '#004A99',
          900: '#003166',
        },
      },
    },
  },
  plugins: [],
}
