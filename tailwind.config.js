/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        pink: '#FFB6C8',
        'deep-pink': '#FF7FA5',
        lavender: '#D9C8FF',
        mint: '#C8F2E0',
        peach: '#FFD9B8',
        ink: '#5A3E4B',
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(90, 62, 75, 0.12)',
        'soft-lg': '0 12px 32px rgba(90, 62, 75, 0.16)',
      },
      animation: {
        flash: 'flash 0.15s ease-out forwards',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0.95' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
