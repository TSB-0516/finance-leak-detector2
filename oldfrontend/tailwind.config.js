/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        surface: {
          base: '#0F1117',
          card: '#1A1D27',
          raised: '#21253A',
          border: '#2A2E45',
        },
        accent: {
          primary: '#7C6AF7',
          soft: '#4E47C2',
          glow: '#A89BFF',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#38BDF8',
        },
        text: {
          primary: '#F1F3FA',
          muted: '#8B90A7',
          faint: '#4B5168',
        },
      },
    },
  },
  plugins: [],
};
