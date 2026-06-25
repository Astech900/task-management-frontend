/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trek-blue': '#2B66FF',
        'trek-blue-light': '#E8EFFF',
        'trek-gray': '#F5F7FA',
        'trek-text': '#1C1F2E',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'trek': '0 20px 40px -15px rgba(43, 102, 255, 0.1)',
        'trek-blue': '0 20px 40px -15px rgba(43, 102, 255, 0.4)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}
