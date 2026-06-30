/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          250: '#dde2e8',
          450: '#8a9bb5',
          555: '#6a7b96',
          550: '#6b7b96',
          650: '#4a5a72',
          750: '#334155',
          755: '#303d4e',
          805: '#1e2a3a',
          850: '#1a2535',
          855: '#172233',
        },
        teal: {
          350: '#55d8c9',
          450: '#2dd4bf',
          550: '#14b8a6',
          650: '#0f766e',
          750: '#115e59',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          650: '#0e7490',
          700: '#0f516b',
        },
        violet: {
          450: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
        },
        metallic: {
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          500: '#94a3b8',
          700: '#475569',
          800: '#334155',
        },
        indigo: {
          455: '#7c8cff',
          650: '#5555dd',
          750: '#4338ca',
        },
        rose: {
          150: '#ffd6dc',
          455: '#ff6b7a',
          650: '#c02030',
        },
        emerald: {
          150: '#a7f3d0',
          455: '#34d399',
        },
        amber: {
          550: '#d97706',
        },
      },
      scale: {
        97: '0.97',
        99: '0.99',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
