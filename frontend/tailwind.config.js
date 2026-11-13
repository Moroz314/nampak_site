/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // ── Фирменная палитра «НАМПАК» ──────────────────────────────────
      colors: {
        // НАМПАК: основные цвета
        'nampack-dark':        '#162330', // глубокий темно-синий графит («НАМ»)
        'nampack-dark-hover':  '#1E2F40',
        'nampack-gold':        '#C59B6D', // крафтово-золотой акцент («ПАК»)
        'nampack-gold-hover':  '#B08455',
        'nampack-gold-light':  '#FAF5EF',
        'nampack-gold-border': '#E8D8C5',

        // Адаптированная светлая тема (совместимость с существующими компонентами)
        'forge-bg':      '#F8FAFC', // чистый светлый фон страницы
        'forge-surface': '#FFFFFF', // белый фон карточек/панелей
        'forge-border':  '#E2E8F0', // светлая граница
        'forge-primary': '#C59B6D', // крафт-золото
        'forge-text':    '#162330', // основной темно-синий текст
        'forge-muted':   '#64748B', // приглушенный серо-синий
        'forge-gold-lt': '#B08455',
        'forge-gold-dk': '#8C5E2D',
      },

      // ── Шрифты ──────────────────────────────────────────────────────
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        serif:   ['Manrope', 'system-ui', 'sans-serif'],
      },

      // ── Тени ────────────────────────────────────────────────────────
      boxShadow: {
        'brand':   '0 4px 20px -2px rgba(22, 35, 48, 0.08)',
        'gold':    '0 4px 20px -2px rgba(197, 155, 109, 0.25)',
        'gold-sm': '0 2px 10px rgba(197, 155, 109, 0.15)',
        'dark':    '0 10px 30px -5px rgba(22, 35, 48, 0.25)',
      },

      // ── Анимации ────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },

  plugins: [],
}
