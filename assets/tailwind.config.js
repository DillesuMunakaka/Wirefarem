/* ============================================================
   Tailwind Play-CDN configuration (shared by every page).
   Load AFTER  https://cdn.tailwindcss.com  in each <head>.
   When you move to Shopify, port these tokens into your
   tailwind.config.js build instead of the CDN.
   ============================================================ */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#479D6E',  // primary
          dark:  '#2F6949',  // hover / deep green
          deep:  '#234E37',  // darkest
          mint:  '#C8E2D4',
          mint2: '#EAF4EE',
          wash:  '#F4F7F5',
          wash2: '#F7FAF8',
        },
        ink:    '#323232',
        muted:  '#656565',
        faint:  '#979797',
        hush:   '#BABABA',
        line:   '#ECEFED',
        line2:  '#DDE2DF',
        amber:  '#F5A623',
        night:  '#1C2023',
        slate2: '#31363A',
      },
      maxWidth: {
        site: '1280px',
        wide: '1240px',
      },
      boxShadow: {
        card: '0 18px 38px rgba(0,0,0,.07)',
        cardH:'0 22px 44px rgba(0,0,0,.09)',
        pop:  '0 18px 40px rgba(0,0,0,.14)',
      },
      keyframes: {
        rise:    { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        floaty:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pop:     { '0%': { transform: 'scale(.85)' }, '60%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)' } },
        pingo:   { '0%': { transform: 'scale(1)', opacity: .9 }, '70%,100%': { transform: 'scale(1.9)', opacity: 0 } },
        pulse2:  { '0%,100%': { opacity: 1 }, '50%': { opacity: .3 } },
        slidedown:{ '0%': { opacity: 0, transform: 'translateY(-10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        toastin: { '0%': { opacity: 0, transform: 'translateY(14px) scale(.98)' }, '100%': { opacity: 1, transform: 'translateY(0) scale(1)' } },
      },
      animation: {
        rise:    'rise .7s ease both',
        floaty:  'floaty 6s ease-in-out infinite',
        pop:     'pop .3s',
        pingo:   'pingo 1.8s ease-out infinite',
        pulse2:  'pulse2 1.5s infinite',
        slidedown:'slidedown .35s ease both',
        toastin: 'toastin .35s cubic-bezier(.2,.9,.2,1) both',
      },
    },
  },
};
