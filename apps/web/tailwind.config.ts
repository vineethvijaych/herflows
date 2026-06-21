import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fef6f4',
          100: '#fde8e3',
          200: '#fbd0c7',
          300: '#f7afa0',
          400: '#f07a6b',
          500: '#e85a4a',
          600: '#d53d2e',
          700: '#b33024',
          800: '#942b22',
          900: '#7a2821',
        },
        peach: {
          50: '#fef9f5',
          100: '#fdf0e8',
          200: '#fbe0cc',
          300: '#f7c9a3',
          400: '#f0a870',
          500: '#e88f4d',
          600: '#d77632',
          700: '#b36028',
          800: '#914f25',
          900: '#764222',
        },
        lavender: {
          50: '#f8f6fa',
          100: '#f0ecf5',
          200: '#e2d9ec',
          300: '#cebfdd',
          400: '#b39cc9',
          500: '#9a7db5',
          600: '#8565a3',
          700: '#71538b',
          800: '#5e4673',
          900: '#4f3c5f',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card': '0 24px 90px rgb(87 67 54 / 0.12)',
        'card-hover': '0 32px 110px rgb(87 67 54 / 0.18)',
        'nav': '0 18px 60px rgb(92 64 51 / 0.1)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.06)',
        'glass-xl': '0 16px 56px rgba(0, 0, 0, 0.08)',
        'glow-coral': '0 0 20px rgba(232, 90, 74, 0.15)',
        'glow-lavender': '0 0 20px rgba(154, 125, 181, 0.15)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.15)',
        'soft': '0 4px 16px rgba(87, 67, 54, 0.06)',
        'soft-lg': '0 8px 32px rgba(87, 67, 54, 0.08)',
        'elevated': '0 12px 48px rgba(87, 67, 54, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'scale-out': 'scaleOut 0.3s ease-in forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'reveal': 'reveal 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
