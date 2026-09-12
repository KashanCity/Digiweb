/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        // همه رنگ‌های برند از متغیرهای CSS در src/styles/theme.css می‌آیند.
        // برای تغییر رنگ‌بندی کل سایت فقط همان فایل را ویرایش کنید.
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          border: 'var(--surface-border)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          subtle: 'var(--ink-subtle)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 0 0 1px var(--surface-border), 0 10px 30px -10px var(--brand-600)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-400) 100%)',
        'hero-radial': 'radial-gradient(80% 60% at 50% 0%, var(--brand-900) 0%, var(--surface) 60%)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeIn: 'fadeIn .4s ease-out',
        shimmer: 'shimmer 1.8s infinite linear',
      },
    },
  },
  plugins: [],
};
