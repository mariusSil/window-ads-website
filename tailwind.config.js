/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx,json}',
  ],
  safelist: [
    'border-red-600',
    'text-red-600',
    'hover:bg-red-600',
    'hover:text-white',
    'border-2',
  ],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#cbd5e1',
        ring: '#DC2626', // Updated to match new primary
        background: '#ffffff',
        foreground: '#020817',
        primary: {
          DEFAULT: '#DC2626',
          foreground: '#ffffff',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          DEFAULT: '#1F2937',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        accent: {
          DEFAULT: '#F3F4F6',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
        },
        success: {
          DEFAULT: '#059669',
          foreground: '#ffffff',
        },
        info: '#2563EB',         // New: Blue
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        navy: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          300: '#7986cb',
          400: '#5c6bc0',
          500: '#3f51b5',
          600: '#3949ab',
          700: '#303f9f',
          800: '#283593',
          900: '#1a237e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography hierarchy from design analysis
        'hero': ['3rem', { lineHeight: '1.1', fontWeight: '700' }], // 48px
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '600' }], // 32px
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
        'h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'cta': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }], // 18px
      },
      spacing: {
        // Consistent spacing system from design analysis
        'section': '5rem', // 80px
        'section-lg': '7.5rem', // 120px
        'component': '3rem', // 48px
        'element': '1.5rem', // 24px
        'tight': '0.5rem', // 8px
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '0.75rem', // 12px
        'button': '0.5rem', // 8px
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#212121',
            lineHeight: '1.6',
          },
        },
      },
    },
  },
  plugins: [],
}
