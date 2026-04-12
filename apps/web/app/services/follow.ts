export function followUser(id: string | number) {
  return useNuxtApp().$api.request(`/api/follow/${id}`, {
    method: "POST",
  });
}

export function unfollowUser(id: string | number) {
  return useNuxtApp().$api.request(`/api/follow/${id}`, {
    method: "DELETE",
  });
}
