import type { AiArticleMetainfo } from "~/types/api";

export function generateArticleMetainfo(content: string) {
  return useNuxtApp().$api.request<AiArticleMetainfo>("/api/ai/metainfo", {
    method: "POST",
    body: {
      content,
    },
  });
}
