import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        circus: {
          bg: '#100e0c',
          surface: '#1a1412',
          surfaceSoft: '#241c18',
          border: '#4a3830',
          text: '#f4eadf',
          muted: '#cbb6a6',
          red: '#6b3032',
          redDeep: '#4a2224',
          cream: '#ead9c8',
          white: '#f6ecdf',
        },
      },
      boxShadow: {
        'circus-glow': '0 0 0 1px rgba(107,48,50,0.4), 0 10px 35px rgba(0,0,0,0.45)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'circus-radial':
          'radial-gradient(1200px 500px at 15% -20%, rgba(107,48,50,0.28), transparent 60%), radial-gradient(1000px 500px at 90% -10%, rgba(74,34,36,0.22), transparent 55%)',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 1px rgba(107,48,50,0.28), 0 8px 24px rgba(0,0,0,0.45)' },
          '50%': { boxShadow: '0 0 0 1px rgba(234,217,200,0.45), 0 14px 36px rgba(0,0,0,0.55)' },
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
