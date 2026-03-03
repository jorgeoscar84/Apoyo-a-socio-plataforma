/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colores principales
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#EFF6FF',
          contrast: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FFFBEB',
          contrast: '#FFFFFF',
        },
        tertiary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#D1FAE5',
          contrast: '#FFFFFF',
        },
        // Colores de estado
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Neutrales
        background: '#FFFFFF',
        surface: '#F9FAFB',
        'surface-secondary': '#F3F4F6',
        'surface-tertiary': '#E5E7EB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        border: '#E5E7EB',
        'border-dark': '#D1D5DB',
      },
      // Tipografía
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tamaños de títulos
        'h1': '40px',
        'h2': '32px',
        'h3': '24px',
        'h4': '20px',
        'h5': '18px',
        'h6': '16px',
        // Tamaños de texto normal
        'base': '16px',
        'sm': '14px',
        'xs': '12px',
      },
      // Espaciado
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      // Border radius
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      // Sombras
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      // Animaciones
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'in-out': 'ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;
