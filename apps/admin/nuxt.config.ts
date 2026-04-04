import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  telemetry: false,
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  hooks: {
    'vite:extendConfig': (config) => {
      config.server ??= {}
      config.server.hmr = {
        ...(typeof config.server.hmr === 'object' ? config.server.hmr : {}),
        port: 24679,
        clientPort: 24679,
      }
    },
  },
})
