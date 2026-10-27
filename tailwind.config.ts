import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 0.8s step-start infinite',
      },
      colors: {
        primary: '#eee9db',
        background: '#0c0b0a',
        'on-primary': '#1a1c1c',
        'on-surface-variant': '#c6c6c6',
        'accent-green': '#ff5262',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      fontFamily: {
        body: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
}

export default config
