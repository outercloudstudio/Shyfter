/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        element: 'var(--element)',
        'element-border': 'var(--element-border)'
      }
    },
  },
  plugins: [],
}

