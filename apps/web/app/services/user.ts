import type { UserBaseInfo, UserSelfDetail } from "~/types/api";

export function getUserBaseInfo(id: string | number) {
  return useNuxtApp().$api.request<UserBaseInfo>("/api/users/base", {
    query: {
      id: String(id),
    },
    auth: false,
  });
}

export function getSelfUserDetail() {
  return useNuxtApp().$api.request<UserSelfDetail>("/api/users/detail");
}
