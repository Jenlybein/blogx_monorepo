import type { FavoriteFolderCreatePayload, FavoriteFolderListData } from "~/types/api";

export function getOwnFavoriteFolders(articleId?: string | number) {
  return useNuxtApp().$api.request<FavoriteFolderListData>("/api/articles/favorite", {
    query: {
      type: 1,
      page: 1,
      limit: 100,
      ...(articleId ? { article_id: String(articleId) } : {}),
    },
  });
}

export function createFavoriteFolder(payload: { title: string; abstract: string; cover?: string }) {
  return useNuxtApp().$api.request<FavoriteFolderCreatePayload>("/api/articles/favorite", {
    method: "PUT",
    body: {
      title: payload.title,
      abstract: payload.abstract,
      cover: payload.cover ?? "",
    },
  });
}
