/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          light: '#DFC088',
          dark: '#B8935A',
          50: '#FBF7EF',
          100: '#F5EDDA',
          200: '#E8D5A3',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE0',
          darker: '#E4DDD0',
        },
        charcoal: {
          DEFAULT: '#2C2416',
          light: '#3D3027',
          lighter: '#5A4A3A',
        },
        brand: {
          text: '#2C2416',
          bg: '#FAF7F2',
          muted: '#8A7A6A',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(44,36,22,0.08)',
        card: '0 2px 16px rgba(44,36,22,0.06)',
        hover: '0 8px 32px rgba(44,36,22,0.14)',
        gold: '0 4px 20px rgba(201,169,110,0.25)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
