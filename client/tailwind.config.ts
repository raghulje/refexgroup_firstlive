import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1210px', // Max content width
      },
    },
    extend: {
      // Font families - Montserrat as default
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      // Custom font sizes matching original site
      fontSize: {
        // Body text sizes
        'body': ['14px', { lineHeight: '20px' }],        // Original body text
        'body-lg': ['16px', { lineHeight: '24px' }],     // Larger body text
        // Hero and heading sizes
        'hero': ['60px', { lineHeight: '60px' }],        // Hero heading (1.0 line-height)
        'nav': ['15px', { lineHeight: 'normal' }],       // Navigation links
        'button': ['16px', { lineHeight: 'normal' }],    // Button text
      },
      // Custom spacing for sections matching original site
      spacing: {
        '15': '60px',   // For standard section padding (vertical)
        '25': '100px',  // For larger section padding (vertical)
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'x-180': 'rotateX(180deg)',
      },
    },
  },
  plugins: [],
} satisfies Config;
