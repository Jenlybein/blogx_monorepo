import type { OptionItem, SearchArticleResponse } from "~/types/api";

export interface SearchArticlesParams {
  type?: 1 | 2 | 3 | 4 | 5;
  key?: string;
  page?: number;
  limit?: number;
  page_mode?: "has_more" | "count";
  sort?: 1 | 2 | 3 | 4 | 5 | 6;
  author_id?: string;
  category_id?: string;
  tag_ids?: string;
  status?: number;
  auth?: boolean;
}

export function searchArticles(params: SearchArticlesParams) {
  const { auth = false, ...query } = params;
  return useNuxtApp().$api.request<SearchArticleResponse>("/api/search/articles", {
    query: query as Record<string, unknown>,
    auth,
  });
}

export function getTagOptions() {
  return useNuxtApp()
    .$api.request<Array<{ id?: string; title?: string; value?: string; label?: string }>>("/api/articles/tags/options", {
      auth: false,
    })
    .then((list) =>
      list.map(
        (item) =>
          ({
            label: item.title ?? item.label ?? "",
            value: item.id ?? item.value ?? "",
          }) satisfies OptionItem,
      ),
    );
}

export function getCategoryOptions(userId: string | number) {
  return useNuxtApp()
    .$api.request<Array<{ id?: string; title?: string; value?: string; label?: string }>>("/api/articles/category/options", {
      auth: false,
      query: {
        user_id: String(userId),
      },
    })
    .then((list) =>
      list.map(
        (item) =>
          ({
            label: item.title ?? item.label ?? "",
            value: item.id ?? item.value ?? "",
          }) satisfies OptionItem,
      ),
    );
}
