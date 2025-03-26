/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#0080ff',
          'secondary': '#ffcc00',
          'accent': '#ff3300',
          'font': '#000',
        },
        font: {
          'primary': 'Roboto'
        }
      },
    },
    plugins: [],
  }