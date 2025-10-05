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
      primary: '#A78BFA',        // Lavender (главный брендовый цвет)
      primaryHover: '#9B8FFF',   // Hover – чуть темнее
      primaryPressed: '#7C6EE6', // Pressed – насыщенный фиолетовый

      accent: '#6D28D9',         // Глубокий фиолетовый для CTA
      accentHover: '#5B21B6',    // Hover по CTA
      criticalHover: '#DC2626', // темнее красный для hover
      criticalPressed: '#B91C1C', // самый тёмный красный для состояния pressed  
      accentPressed: '#4C1D95',  // Pressed по CTA
      inactive: '#D1D5DB',       // Неактивные элементы (светло-серый)

      secondaryItems: '#8B5CF6', // Доп. элементы (иконки, выделения)
      secondaryStroke: '#E5E7EB',// Бордеры и линии
      cards: '#FFFFFF',          // Карточки, поверхности
      secondaryBackground: '#F3F4F6',
      devider: '#E5E7EB',
      greyNobel: '#B4B4B4',
      minorBackground: '#F9FAFB',

      success: '#10B981',        // Зеленый – успех
      warning: '#F59E0B',        // Желтый – предупреждение
      critical: '#EF4444',       // Красный – ошибка
      info: '#3B82F6',           // Синий – информационные сообщения

      background: '#FAF9FF',     // Общий фон (очень светлый лаванда)
      surface: '#FFFFFF',        // Поверхности (блоки, формы)
      divider: '#E5E7EB',        // Разделители, линии

      text: '#111827',           // Основной текст (тёмно-серый, почти чёрный)
      secondaryText: '#6B7280',  // Вторичный текст (светло-серый)
      invertText: '#FFFFFF',     // Текст на цветных/тёмных фонах (кнопки)

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
