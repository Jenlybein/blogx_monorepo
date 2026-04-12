import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  telemetry: false,
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/tailwind.css"],
  build: {
    transpile: ["naive-ui", "vueuc", "date-fns"],
  },
  vite: {
    ssr: {
      noExternal: ["naive-ui", "vueuc", "date-fns"],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.BLOGX_WEB_API_BASE || "http://127.0.0.1:8080",
    },
  },
  routeRules: {
    "/": { swr: 60 },
    "/search": { swr: 30 },
    "/article/**": { swr: 30 },
    "/users/**": { swr: 30 },
  },
  devServer: {
    port: 3000,
  },
  hooks: {
    'vite:extendConfig': (config) => {
      const viteConfig = config as {
        server?: {
          hmr?: boolean | Record<string, unknown>;
        };
      }

      viteConfig.server ??= {}
      viteConfig.server.hmr = {
        ...(typeof viteConfig.server.hmr === 'object' ? viteConfig.server.hmr : {}),
        port: 24678,
        clientPort: 24678,
      }
    },
  },
})
