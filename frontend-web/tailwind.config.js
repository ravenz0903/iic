/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a2e',
          elevated: '#252540'
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
          purple: '#8b5cf6'
        },
        grade: {
          A: '#10b981',
          B: '#f59e0b',
          C: '#f43f5e',
          Rejected: '#6b7280'
        }
      }
    },
  },
  plugins: [],
}
