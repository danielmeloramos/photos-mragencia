/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true
  },
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#0E0E0E'
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        },
        border: {
          light: '#bbb',
          dark: '#2D2D2D'
        },
        img: {
          background: {
            dark: '#161616',
            light: '#fff'
          }
        },
        whatsapp: '#0D6D47'
      },
      boxShadow: {
        highlight: 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
      },
      screens: {
        narrow: { raw: '(max-aspect-ratio: 3 / 2)' },
        wide: { raw: '(min-aspect-ratio: 3 / 2)' },
        'taller-than-854': { raw: '(min-height: 854px)' },
        ultrawide: '2100px'
      }
    }
  },
  plugins: []
}
