import { getRequestURL, getRouterParam, proxyRequest } from "h3";
import type { H3Event } from "h3";

function normalizeOrigin(origin: string) {
  return origin.endsWith("/") ? origin : `${origin}/`;
}

function normalizePath(path: string) {
  return path.replace(/^\/+/, "");
}

export function resolveProxyTarget(origin: string, path: string, search: string) {
  const targetUrl = new URL(normalizePath(path), normalizeOrigin(origin));
  targetUrl.search = search;
  return targetUrl.toString();
}

export function proxyRoutePath(event: H3Event, origin: string, pathPrefix = "") {
  const requestPath = getRouterParam(event, "path") || "";
  const requestUrl = getRequestURL(event);
  const joinedPath = pathPrefix ? `${normalizePath(pathPrefix)}/${normalizePath(requestPath)}` : requestPath;
  return proxyRequest(event, resolveProxyTarget(origin, joinedPath, requestUrl.search));
}
