import { createApiClient } from "~/services/http/client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const normalizedApiBase = String(config.public.apiBase || "").trim();
  const allowCrossOriginApiBase = Boolean(config.public.allowCrossOriginApiBase);

  if (normalizedApiBase !== "/_backend") {
    const message =
      `[AuthGuard] 检测到 NUXT_PUBLIC_API_BASE=${normalizedApiBase || "(empty)"}，当前项目默认要求使用 /_backend 同源代理以保证登录态稳定。` +
      `若你确认要跨域直连，请显式设置 NUXT_PUBLIC_ALLOW_CROSS_ORIGIN_API_BASE=true，并补齐跨域凭据策略（CORS + credentials + cookie SameSite/Secure）。`;

    if (!allowCrossOriginApiBase) {
      throw new Error(message);
    }

    console.warn(message);
  }

  return {
    provide: {
      api: createApiClient(config.public.apiBase),
    },
  };
});
