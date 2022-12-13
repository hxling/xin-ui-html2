/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      // strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
  ],
  variants: {
    backgroundColor: ['responsive', 'dark', 'hover'],
  },
}
