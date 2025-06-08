/* filepath: c:\Users\Nisha Shetty\Downloads\BNV Task\student-management\frontend\tailwind.config.js */
import { addBase, addComponents, addUtilities } from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    addBase({}),
    addComponents({
      ".btn": {
        "@apply px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2":
          {},
      },
      ".btn-primary": {
        "@apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500":
          {},
      },
      ".btn-secondary": {
        "@apply bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500":
          {},
      },
      ".btn-danger": {
        "@apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500": {},
      },
      ".input": {
        "@apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500":
          {},
      },
      ".card": {
        "@apply bg-white rounded-lg shadow-md p-6": {},
      },
    }),
    addUtilities({}),
  ],
};
