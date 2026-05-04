import { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        'primary-dark': '#0051D5',
        secondary: '#1A1A1A',
        surface: '#F5F5F5',
        border: '#E5E5EA',
      },
    },
  },
  plugins: [],
}

export default config
