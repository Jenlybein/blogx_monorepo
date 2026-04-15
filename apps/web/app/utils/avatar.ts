const AVATAR_FIELD_CANDIDATES = [
  "avatar",
  "user_avatar",
  "avatar_url",
  "author_avatar",
  "action_user_avatar",
  "receiver_avatar",
  "followed_avatar",
  "fans_avatar",
] as const;

const NAME_FIELD_CANDIDATES = [
  "nickname",
  "user_nickname",
  "username",
  "user_name",
  "author_name",
  "action_user_nickname",
  "receiver_nickname",
  "followed_nickname",
  "fans_nickname",
  "name",
] as const;

function normalizeAvatarUrl(raw: string): string {
  const value = raw.trim();
  if (!value) {
    return "";
  }

  if (/^(?:https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  // 后端历史数据里头像常是相对路径，统一走 Nuxt 反向代理避免 404/CORS。
  if (value.startsWith("/_backend/")) {
    return value;
  }
  if (value.startsWith("/")) {
    return `/_backend${value}`;
  }

  return `/_backend/${value.replace(/^\/+/, "")}`;
}

export function resolveAvatarUrl(input: unknown): string {
  if (typeof input === "string") {
    return normalizeAvatarUrl(input);
  }

  if (!input || typeof input !== "object") {
    return "";
  }

  const candidate = input as Record<string, unknown>;
  for (const key of AVATAR_FIELD_CANDIDATES) {
    const value = candidate[key];
    if (typeof value !== "string") {
      continue;
    }
    const normalized = value.trim();
    if (normalized) {
      return normalizeAvatarUrl(normalized);
    }
  }

  return "";
}

export function resolveDisplayName(input: unknown): string {
  if (typeof input === "string") {
    return input.trim();
  }

  if (!input || typeof input !== "object") {
    return "";
  }

  const candidate = input as Record<string, unknown>;
  for (const key of NAME_FIELD_CANDIDATES) {
    const value = candidate[key];
    if (typeof value !== "string") {
      continue;
    }
    const normalized = value.trim();
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

export function resolveAvatarInitial(nameInput: unknown, fallback = "?"): string {
  const name = resolveDisplayName(nameInput);
  const first = [...name][0];
  if (!first) {
    return fallback;
  }
  return /^[a-zA-Z]$/u.test(first) ? first.toUpperCase() : first;
}
