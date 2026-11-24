/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3EBDD',
        ink: '#14231F',
        'faded-ink': '#5B6B63',
        vermilion: '#E4422B',
        mustard: '#E9A800',
        teal: '#0E7C7B',
        rose: '#D94F8A'
      },
      fontFamily: {
        serif: ['Newsreader', 'Tiro Bangla', 'serif'],
        sans: ['Hind Siliguri', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        banglaHead: ['Tiro Bangla', 'serif']
      },
      boxShadow: {
        'ink-blot': '3px 4px 0px 0px rgba(20, 35, 31, 0.85)',
        'ink-lg': '5px 6px 0px 0px rgba(20, 35, 31, 0.95)',
        'stamp': '0px 0px 0px 2px #E4422B'
      }
    }
  },
  plugins: []
};
