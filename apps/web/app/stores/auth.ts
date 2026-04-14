import { loginWithEmailCode, loginWithPassword, logoutCurrentSession, registerWithEmail } from "~/services/auth";
import { getSelfUserDetail } from "~/services/user";
import type { UserSelfDetail } from "~/types/api";

export const useAuthStore = defineStore("auth", () => {
  const tokenStorageKey = "blogx_access_token";
  const profileStorageKey = "blogx_profile_snapshot";
  function isValidUserSnapshot(input: unknown): input is UserSelfDetail {
    if (!input || typeof input !== "object") {
      return false;
    }

    const candidate = input as Partial<UserSelfDetail>;
    return typeof candidate.id === "string" && (typeof candidate.nickname === "string" || typeof candidate.username === "string");
  }

  const initialToken = import.meta.client ? localStorage.getItem(tokenStorageKey) || "" : "";
  const initialProfile = (() => {
    if (!import.meta.client) {
      return null;
    }

    const raw = localStorage.getItem(profileStorageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (isValidUserSnapshot(parsed)) {
        return parsed;
      }
      localStorage.removeItem(profileStorageKey);
      return null;
    } catch {
      localStorage.removeItem(profileStorageKey);
      return null;
    }
  })();

  const accessToken = shallowRef(initialToken);
  const initialized = shallowRef(false);
  const pending = shallowRef(false);
  const currentUser = ref<UserSelfDetail | null>(initialProfile);
  let initPromise: Promise<boolean> | null = null;
  let refreshPromise: Promise<boolean> | null = null;

  function persistCurrentUser(user: UserSelfDetail | null) {
    if (!import.meta.client) {
      return;
    }

    if (user) {
      localStorage.setItem(profileStorageKey, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(profileStorageKey);
  }

  function restoreCachedProfile() {
    if (!import.meta.client) {
      return null;
    }

    const raw = localStorage.getItem(profileStorageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!isValidUserSnapshot(parsed)) {
        localStorage.removeItem(profileStorageKey);
        return null;
      }
      currentUser.value = parsed;
      return parsed;
    } catch {
      localStorage.removeItem(profileStorageKey);
      return null;
    }
  }

  function setAccessToken(token: string) {
    accessToken.value = token;
    if (import.meta.client) {
      if (token) {
        localStorage.setItem(tokenStorageKey, token);
      } else {
        localStorage.removeItem(tokenStorageKey);
      }
    }
  }

  function clearSession() {
    accessToken.value = "";
    currentUser.value = null;
    if (import.meta.client) {
      localStorage.removeItem(tokenStorageKey);
      localStorage.removeItem(profileStorageKey);
    }
    useMessageStore().clear();
    useChatStore().resetSocketState();
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) {
      currentUser.value = null;
      return null;
    }

    try {
      currentUser.value = await getSelfUserDetail();
      persistCurrentUser(currentUser.value);
      return currentUser.value;
    } catch {
      return null;
    }
  }

  async function refreshSession() {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;
        const response = await $fetch<{ code: number; msg: string; data: string }>("/api/users/refresh", {
          baseURL: config.public.apiBase,
          method: "POST",
          credentials: "include",
          headers,
          retry: 0,
        });

        if (response.code !== 0 || !response.data) {
          clearSession();
          return false;
        }

        setAccessToken(response.data);
        await fetchCurrentUser();
        await useMessageStore().refreshSummary().catch(() => undefined);
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  async function initializeSession() {
    if (initialized.value) return !!accessToken.value;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      if (import.meta.client) {
        if (!accessToken.value) {
          const cached = localStorage.getItem(tokenStorageKey) || "";
          if (cached) {
            setAccessToken(cached);
          }
        }
        if (accessToken.value && !currentUser.value) {
          restoreCachedProfile();
        }
      }

      if (!accessToken.value) {
        initialized.value = true;
        initPromise = null;
        return false;
      }

      const restored = await fetchCurrentUser();
      if (!restored) {
        clearSession();
      }

      initialized.value = true;
      initPromise = null;
      return !!restored;
    })();

    return initPromise;
  }

  async function loginByPassword(payload: { username: string; password: string }) {
    pending.value = true;
    try {
      const token = await loginWithPassword(payload);
      setAccessToken(token);
      await fetchCurrentUser();
      await useMessageStore().refreshSummary().catch(() => undefined);
      initialized.value = true;
      return true;
    } finally {
      pending.value = false;
    }
  }

  async function loginByEmailCode(payload: { email_id: string; email_code: string }) {
    pending.value = true;
    try {
      const token = await loginWithEmailCode(payload);
      setAccessToken(token);
      await fetchCurrentUser();
      await useMessageStore().refreshSummary().catch(() => undefined);
      initialized.value = true;
      return true;
    } finally {
      pending.value = false;
    }
  }

  async function registerByEmail(payload: { pwd: string; email_id: string; email_code: string }) {
    pending.value = true;
    try {
      const token = await registerWithEmail(payload);
      setAccessToken(token);
      await fetchCurrentUser();
      await useMessageStore().refreshSummary().catch(() => undefined);
      initialized.value = true;
      return true;
    } finally {
      pending.value = false;
    }
  }

  async function logout() {
    try {
      if (accessToken.value) {
        await logoutCurrentSession();
      }
    } finally {
      clearSession();
      initialized.value = true;
    }
  }

  const isLoggedIn = computed(() => !!accessToken.value);
  const profileId = computed(() => currentUser.value?.id ?? null);
  const profileName = computed(() => {
    if (!currentUser.value) {
      return "未登录";
    }
    return currentUser.value.nickname || currentUser.value.username || "";
  });

  return {
    accessToken,
    initialized,
    pending,
    currentUser,
    isLoggedIn,
    profileId,
    profileName,
    setAccessToken,
    clearSession,
    fetchCurrentUser,
    refreshSession,
    initializeSession,
    loginByPassword,
    loginByEmailCode,
    registerByEmail,
    logout,
  };
});
