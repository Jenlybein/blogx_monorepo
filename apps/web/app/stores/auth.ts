import { loginWithEmailCode, loginWithPassword, logoutCurrentSession, registerWithEmail } from "~/services/auth";
import { getSelfUserDetail } from "~/services/user";
import type { UserSelfDetail } from "~/types/api";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = shallowRef("");
  const initialized = shallowRef(false);
  const pending = shallowRef(false);
  const currentUser = ref<UserSelfDetail | null>(null);
  let initPromise: Promise<boolean> | null = null;
  let refreshPromise: Promise<boolean> | null = null;

  function setAccessToken(token: string) {
    accessToken.value = token;
  }

  function clearSession() {
    accessToken.value = "";
    currentUser.value = null;
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) {
      currentUser.value = null;
      return null;
    }

    try {
      currentUser.value = await getSelfUserDetail();
      return currentUser.value;
    } catch {
      currentUser.value = null;
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
      const restored = await refreshSession();
      initialized.value = true;
      initPromise = null;
      return restored;
    })();

    return initPromise;
  }

  async function loginByPassword(payload: { username: string; password: string }) {
    pending.value = true;
    try {
      const token = await loginWithPassword(payload);
      setAccessToken(token);
      await fetchCurrentUser();
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
  const profileName = computed(() => currentUser.value?.nickname || currentUser.value?.username || "未登录");

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
