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

const envProfile = (process.env.BLOGX_WEB_ENV_PROFILE || 'local-local').trim() || 'local-local'
hydrateProcessEnv('env/common.env')
hydrateProcessEnv(`env/${envProfile}.env`)

function normalizeOrigin(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

const apiUpstream = normalizeOrigin(
  process.env.BLOGX_WEB_API_UPSTREAM ||
    process.env.NUXT_API_ORIGIN ||
    process.env.NUXT_PUBLIC_API_BASE ||
    'http://127.0.0.1:8080',
)

const siteUrl = normalizeOrigin(process.env.BLOGX_WEB_SITE_URL || 'http://localhost:3000')
const apiBase = String(process.env.BLOGX_WEB_API_BASE || '/api').trim() || '/api'
const wsPath = String(process.env.BLOGX_WEB_WS_PATH || '/api/chat/ws').trim() || '/api/chat/ws'
const assetProxyBase = String(process.env.BLOGX_WEB_ASSET_PROXY_BASE || '/_origin').trim() || '/_origin'

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
    envProfile,
    apiUpstream,
    public: {
      envProfile,
      siteUrl,
      apiBase,
      wsPath,
      assetProxyBase,
      uploadsBase: "/uploads",
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    devProxy: {
      [wsPath]: {
        target: apiUpstream,
        changeOrigin: true,
        ws: true,
      },
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
