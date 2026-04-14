import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineNuxtConfig } from 'nuxt/config'

const appRoot = dirname(fileURLToPath(import.meta.url))

function hydrateProcessEnv(relativePath: string) {
  const envPath = resolve(appRoot, relativePath)
  if (!existsSync(envPath)) {
    return
  }

  const source = readFileSync(envPath, 'utf8')
  for (const rawLine of source.split(/\r?\n/u)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) {
      continue
    }

    const separatorIndex = line.indexOf('=')
    if (separatorIndex <= 0) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    if (!key || process.env[key] !== undefined) {
      continue
    }

    let value = line.slice(separatorIndex + 1).trim()
    const isQuoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
    if (isQuoted) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

hydrateProcessEnv('.env.local')
hydrateProcessEnv('.env')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  telemetry: false,
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/fonts.css", "~/assets/css/tailwind.css"],
  build: {
    transpile: ["naive-ui", "vueuc", "date-fns"],
  },
  vite: {
    optimizeDeps: {
      include: [
        "@vee-validate/zod",
        "vee-validate",
        "zod",
        "@tabler/icons-vue",
        "markdown-it-katex",
        "markdown-it-ins",
        "highlight.js",
        "mermaid",
      ],
    },
    ssr: {
      noExternal: ["naive-ui", "vueuc", "date-fns"],
    },
  },
  runtimeConfig: {
    apiOrigin: process.env.NUXT_API_ORIGIN || process.env.BLOGX_WEB_API_BASE || process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8080",
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/_backend",
    },
  },
  routeRules: {
    "/search": { ssr: false },
    "/studio/**": { ssr: false },
    ...(process.env.NODE_ENV === "production"
      ? {
          "/article/**": { swr: 30 },
          "/users/**": { swr: 30 },
        }
      : {}),
  },
  devServer: {
    port: 3000,
  },
})
