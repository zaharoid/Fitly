import defaultTheme from 'tailwindcss/defaultTheme';
import * as myPlugins from './twTheme/tw-plugins';

module.exports = {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',
    './composables/**/*.ts',
    './entries/**/*.ts',
    './mappers/**/*.ts',
  ],
  prefix: 't-',
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      mdMax: { max: '767px' },
      lg: '976px',
      lgMax: { max: '975px' },
      xl: '1024px',
      xlMax: { max: '1023px' },
      '2xl': '1280px',
      '2xlMax': { max: '1279px' },
      gt: '1440px',
    },
    colors: {
      gray: {
        50: '#F9FAFB',
        300: '#D1D5DB',
        900: '#111827',
        950: '#0F172A',
      },
      blue: {
        400: '#60A5FA',
      },
      primary: '#A78BFA',
      primaryHover: '#9B8FFF',
      primaryPressed: '#7C6EE6',
      accent: '#6D28D9',
      accentHover: '#5B21B6',
      criticalHover: '#DC2626',
      criticalPressed: '#B91C1C',
      accentPressed: '#4C1D95',
      inactive: '#D1D5DB',
      secondaryItems: '#8B5CF6',
      mediumStateBlue: '#9b64f4',
      secondaryStroke: '#a9c5ef',
      cards: '#FFFFFF',
      secondaryBackground: '#dfecff',
      fuchsia: '#d94ee3',
      greyNobel: '#B4B4B4',
      minorBackground: '#F9FAFB',
      success: '#10B981',
      warning: '#f6b50c',
      warningBg: '#fcf6d5',
      critical: '#EF4444',
      info: '#3B82F6',
      background: '#FAF9FF',
      surface: '#FFFFFF',
      divider: '#E5E7EB',
      text: '#111827',
      secondaryText: '#6B7280',
      invertText: '#FFFFFF',

      black: '#000000',
      white: '#FFFFFF',
      transparent: '#0000',
    },
    fontFamily: {
      title: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont'],
      content: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont'],
      mono: [
        'Klarna',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    zIndex: () => {
      const main = {
        aboveAll: 200,
        alert: 90,
        overlay: 80,
        popup: 70,
        navbar: 60,
        rearOverlay: 50,
        tooltip: 75,
        dropdown: 30,
        floating: 20,
        base: 1,
        background: -1,
      };

      const additional: { [key: string]: number } = {};
      Object.entries(main).forEach(([key, val]) => {
        for (let i = 1; i <= 3; i += 1) {
          additional[`${key}+${i}`] = val + i;
        }
      });

      return Object.assign(main, additional);
    },
    extend: {
      spacing: () => {
        const negativeSpacing: { [key: string]: string } = {};
        Object.entries(defaultTheme.spacing).forEach(([key, val]) => {
          negativeSpacing[`-${key}`] = `-${val}`;
        });
        return negativeSpacing;
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['14px', '20px'],
      base: ['16px', '22px'],
      lg: ['18px', '28px'],
      ml: ['20px', '26px'],
      xl: ['24px', '31px'],
      '2xl': ['32px', '42px'],
      '3xl': ['44px', '57px'],
    },
  },
  safelist: [
    { pattern: /t-bg-+/ },
  ],
  ...myPlugins,
};
