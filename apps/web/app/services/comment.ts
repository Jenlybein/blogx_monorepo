import type { CommentReplyListData, CommentRootListData } from "~/types/api";

export function getRootComments(articleId: string | number) {
  return useNuxtApp().$api.request<CommentRootListData>("/api/comments", {
    query: {
      article_id: String(articleId),
    },
  });
}

export function getReplyComments(articleId: string | number, rootId: string, page = 1, limit = 10) {
  return useNuxtApp().$api.request<CommentReplyListData>("/api/comments/replies", {
    query: {
      article_id: String(articleId),
      root_id: String(rootId),
      page,
      limit,
    },
  });
}

export function createComment(payload: { article_id: string; content: string; reply_id?: string }) {
  return useNuxtApp().$api.request("/api/comments", {
    method: "POST",
    body: payload,
  });
}

export function diggComment(id: string) {
  return useNuxtApp().$api.request(`/api/comments/${String(id)}/digg`, {
    method: "POST",
  });
}
