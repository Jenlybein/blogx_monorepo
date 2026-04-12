import type { ArticleDetail, ArticleTopItem } from "~/types/api";

export function getTopArticles() {
  return useNuxtApp().$api.request<{ list: ArticleTopItem[]; count: number }>("/api/articles/top", {
    auth: false,
  });
}

export function getArticleDetail(id: string | number) {
  return useNuxtApp().$api.request<ArticleDetail>(`/api/articles/${id}`);
}

export function markArticleViewed(id: string | number) {
  return useNuxtApp().$api.request("/api/articles/view", {
    method: "POST",
    body: {
      article_id: String(id),
    },
  });
}

export function toggleArticleDigg(id: string | number) {
  return useNuxtApp().$api.request(`/api/articles/${id}/digg`, {
    method: "PUT",
  });
}

export function favoriteArticle(articleId: string | number, favorId?: number) {
  return useNuxtApp().$api.request("/api/articles/favorite", {
    method: "POST",
    body: {
      article_id: String(articleId),
      ...(favorId ? { favor_id: String(favorId) } : {}),
    },
  });
}
