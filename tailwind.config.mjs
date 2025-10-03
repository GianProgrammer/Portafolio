/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'space-dark': '#0a0a0a',
        'space-purple': '#6a0dad',
        'space-cyan': '#00ffff',
        'space-violet': '#8a2be2',
        'neon-cyan': '#00ffff',
        'neon-purple': '#ff00ff',
        'deep-space': '#1a0033',
        'cosmic-blue': '#000033'
      },
      fontFamily: {
        'space': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'orbit': 'orbit 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          'from': { boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff' },
          'to': { boxShadow: '0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff' }
        },
        orbit: {
          'from': { transform: 'rotate(0deg) translateX(100px) rotate(0deg)' },
          'to': { transform: 'rotate(360deg) translateX(100px) rotate(-360deg)' }
        }
      }
    },
  },
  plugins: [],
}