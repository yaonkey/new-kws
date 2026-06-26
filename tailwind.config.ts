import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        circus: {
          bg: '#0a0a0f',
          surface: '#151520',
          surfaceSoft: '#1b1b29',
          border: '#3a2231',
          text: '#f5f2f0',
          muted: '#b8b0b5',
          red: '#cf2d3a',
          redDeep: '#8f1624',
          white: '#ffffff',
        },
      },
      boxShadow: {
        'circus-glow': '0 0 0 1px rgba(207,45,58,0.35), 0 10px 35px rgba(0,0,0,0.45)',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'circus-radial':
          'radial-gradient(1200px 500px at 15% -20%, rgba(207,45,58,0.22), transparent 60%), radial-gradient(1000px 500px at 90% -10%, rgba(143,22,36,0.2), transparent 55%)',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(207,45,58,0.22), 0 8px 24px rgba(0,0,0,0.45)' },
          '50%': { boxShadow: '0 0 0 1px rgba(207,45,58,0.55), 0 14px 36px rgba(0,0,0,0.55)' },
        },
        riseFade: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        glowPulse: 'glowPulse 2.8s ease-in-out infinite',
        riseFade: 'riseFade 360ms ease-out both',
      },
    },
  },
}
