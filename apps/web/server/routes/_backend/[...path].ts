import { defineEventHandler, getRequestURL, getRouterParam, proxyRequest } from "h3";

function normalizeOrigin(origin: string) {
  return origin.endsWith("/") ? origin : `${origin}/`;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const requestPath = getRouterParam(event, "path") || "";
  const requestUrl = getRequestURL(event);
  const targetUrl = new URL(requestPath, normalizeOrigin(runtimeConfig.apiOrigin));

  targetUrl.search = requestUrl.search;

  return proxyRequest(event, targetUrl.toString());
});
