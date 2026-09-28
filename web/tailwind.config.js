/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // Allows Material UI styles and Tailwind utilities to coexist cleanly
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
