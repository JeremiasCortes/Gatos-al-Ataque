/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        success: '#95E1D3',
        warning: '#FFE66D',
        danger: '#F38181',
        dark: '#2D3436',
        light: '#F7F7F7',
        energy: '#A8E6CF',
        money: '#FFD93D',
        food: '#FF8C42',
        health: '#FF6B9D',
      },
      animation: {
        'bounce-slow': 'bounce 1s infinite',
        'pulse-fast': 'pulse 0.5s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #FF6B6B' },
          'to': { boxShadow: '0 0 20px #FF6B6B, 0 0 30px #FF6B6B' },
        },
      },
    },
  },
  plugins: [],
}
