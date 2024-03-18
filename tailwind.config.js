/** @type {import('tailwindcss').Config} */
import('tailwindcss').Config

export default {
  content: [
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    import('flowbite/plugin'),
  ]
}

