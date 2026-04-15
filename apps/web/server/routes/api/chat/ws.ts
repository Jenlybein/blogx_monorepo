import WebSocket from "crossws/websocket";
import type { Message, Peer } from "crossws";

type UpstreamSocket = InstanceType<typeof WebSocket>;

interface RelayState {
  upstream: UpstreamSocket;
  queue: unknown[];
  closed: boolean;
}

const relayStates = new WeakMap<Peer, RelayState>();

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizeBasePath(value: unknown) {
  const path = String(value || "/api").trim() || "/api";
  return path.startsWith("/") ? path.replace(/\/+$/u, "") || "/" : `/${path.replace(/\/+$/u, "")}`;
}

function resolveUpstreamWsUrl(request: Request) {
  const config = useRuntimeConfig();
  const requestUrl = new URL(request.url);
  const apiBase = normalizeBasePath(config.public.apiBase);
  const upstreamUrl = new URL(trimTrailingSlash(String(config.apiUpstream || "http://127.0.0.1:8080")));
  const suffix = requestUrl.pathname.startsWith(`${apiBase}/`)
    ? requestUrl.pathname.slice(apiBase.length)
    : requestUrl.pathname;

  upstreamUrl.protocol = upstreamUrl.protocol === "https:" ? "wss:" : "ws:";
  upstreamUrl.pathname = `${apiBase}${suffix}`.replace(/\/{2,}/gu, "/");
  upstreamUrl.search = requestUrl.search;
  return upstreamUrl.toString();
}

function toCloseReason(reason: unknown) {
  if (typeof reason === "string") return reason;
  if (reason instanceof Uint8Array) return new TextDecoder().decode(reason);
  return "";
}

function toCloseCode(code: unknown) {
  return typeof code === "number" && code >= 1000 && code <= 4999 ? code : 1011;
}

function closePeer(peer: Peer, code = 1011, reason = "WebSocket relay closed") {
  try {
    peer.close(toCloseCode(code), reason.slice(0, 120));
  } catch {
    peer.terminate();
  }
}

export default defineWebSocketHandler({
  open(peer) {
    const upstream = new WebSocket(resolveUpstreamWsUrl(peer.request));
    const state: RelayState = {
      upstream,
      queue: [],
      closed: false,
    };
    relayStates.set(peer, state);

    upstream.on("open", () => {
      for (const data of state.queue.splice(0)) {
        upstream.send(data);
      }
    });

    upstream.on("message", (data: unknown) => {
      peer.send(data);
    });

    upstream.on("close", (code: number, reason: unknown) => {
      state.closed = true;
      closePeer(peer, code, toCloseReason(reason));
    });

    upstream.on("error", () => {
      state.closed = true;
      closePeer(peer, 1011, "Upstream WebSocket error");
    });

    upstream.on("unexpected-response", (_request: unknown, response: { statusCode?: number; resume?: () => void }) => {
      state.closed = true;
      closePeer(peer, 1008, `Upstream rejected WebSocket: ${response.statusCode ?? "unknown"}`);
      response.resume?.();
    });
  },

  message(peer, message: Message) {
    const state = relayStates.get(peer);
    if (!state || state.closed) return;

    if (state.upstream.readyState === WebSocket.OPEN) {
      state.upstream.send(message.rawData);
      return;
    }

    state.queue.push(message.rawData);
  },

  close(peer, details) {
    const state = relayStates.get(peer);
    relayStates.delete(peer);
    if (!state || state.closed) return;

    state.closed = true;
    if (state.upstream.readyState === WebSocket.OPEN || state.upstream.readyState === WebSocket.CONNECTING) {
      state.upstream.close(toCloseCode(details.code), details.reason);
    }
  },

  error(peer) {
    const state = relayStates.get(peer);
    relayStates.delete(peer);
    if (!state || state.closed) return;

    state.closed = true;
    state.upstream.close(1011, "Client WebSocket error");
  },
});
