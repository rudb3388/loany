export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Confianza — Préstamos entre personas',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Plataforma de préstamos P2P: pide desde 300 € hasta 50.000 € financiados por múltiples inversores. Niveles de confianza y perfiles verificados.',
        },
        { name: 'theme-color', content: '#0f766e' },
      ],
    },
  },
})
