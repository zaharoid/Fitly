import plugin from 'tailwindcss/plugin';

module.exports = {
  plugins: [
    plugin(function ({ addComponents }:
        { addComponents: (components: Record<string, Record<string, string>> |
            Record<string, Record<string, string>>[], options?: object) => void }) {
      addComponents({
        '.mobile-full-screen': {
          '@media (max-width: 768px)': `
            border-radius: 0 !important;
            height: calc(100vh - 51px) !important;
            left: 0;
            margin: 0;
            position: fixed !important;
            top: 51px !important;
            width: 100vw !important;
            max-height: none !important;
            min-height: auto !important;
            @supports (height: 100svh) {
              height: calc(100svh - 51px) !important; /* For browsers that do support svh */
            }
            :slotted(aside) {
              margin: 0;
              position: relative;
              width: 100%;
            }
          `,
        },
      });
    }),
  ],
};
