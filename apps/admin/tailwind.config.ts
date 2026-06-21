import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          sidebar: '#1e1e2d',
          'sidebar-hover': '#2a2a3d',
          bg: '#f5f5f5',
          card: '#ffffff',
          accent: '#5867dd',
          'accent-hover': '#4a55c5',
          text: '#333333',
          'text-muted': '#888888',
          'text-secondary': '#64748b',
          border: '#e2e8f0',
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
