<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { IconEye, IconHeart, IconMessageCircle2, IconShare2, IconThumbUp } from "@tabler/icons-vue";
import { NAvatar, NButton, NTag, useMessage } from "naive-ui";
import ArticleTocAnchor from "~/components/article/ArticleTocAnchor.vue";
import CommentComposer from "~/components/comment/CommentComposer.vue";
import CommentThread from "~/components/comment/CommentThread.vue";
import FavoriteFolderModal from "~/components/favorite/FavoriteFolderModal.vue";
import { useArticleMarkdown } from "~/composables/useArticleMarkdown";
import { useReadingProgress } from "~/composables/useReadingProgress";
import { ApiBusinessError } from "~/services/http/errors";
import { getArticleDetail, markArticleViewed, toggleArticleDigg } from "~/services/article";
import { createComment, diggComment, getReplyComments, getRootComments } from "~/services/comment";
import type { CommentReplyItem } from "~/types/api";
import { formatCount, formatDateTimeLabel } from "~/utils/format";

const route = useRoute();
const router = useRouter();
const articleId = computed(() => route.params.id as string);
const authStore = useAuthStore();
const uiStore = useUiStore();
const message = useMessage();

const ROOT_COMMENT_PAGE_SIZE = 7;
const REPLY_COMMENT_PAGE_SIZE = 3;
const favoriteModalOpen = ref(false);

const { data: article, error: articleError, refresh: refreshArticle } = await useAsyncData(
  () => `article-${articleId.value}`,
  () => getArticleDetail(articleId.value),
);
const articleLoadError = computed(() => {
  const error = articleError.value;
  if (!error) {
    return "";
  }

  if (error instanceof ApiBusinessError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "文章详情暂时无法加载。";
});

const commentsPager = await usePagedResourceCache({
  cacheKey: () => `article-comments:${articleId.value}`,
  pageSize: () => ROOT_COMMENT_PAGE_SIZE,
  fetchPage: async (page, limit) => {
    try {
      const payload = await getRootComments(articleId.value, page, limit);
      return {
        items: payload.list,
        hasMore: payload.has_more,
      };
    } catch {
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

interface ReplyPagePayload {
  items: CommentReplyItem[];
  hasMore: boolean;
}

interface ReplyPagerState {
  currentPage: number;
  pages: Record<number, ReplyPagePayload>;
  pending: boolean;
  replyCount: number;
}

const replyStates = shallowRef<Record<string, ReplyPagerState>>({});
const replyTarget = ref<{ id: string; nickname: string } | null>(null);

function ensureReplyState(rootId: string) {
  const current = replyStates.value[rootId];
  if (current) {
    return current;
  }

  const nextState: ReplyPagerState = {
    currentPage: 1,
    pages: {},
    pending: false,
    replyCount: 0,
  };

  replyStates.value = {
    ...replyStates.value,
    [rootId]: nextState,
  };

  return nextState;
}

function resetReplyState(rootId: string) {
  const current = ensureReplyState(rootId);
  current.currentPage = 1;
  current.pages = {};
  current.pending = false;
  current.replyCount = 0;
  replyStates.value = {
    ...replyStates.value,
    [rootId]: current,
  };
}

const { renderedHtml: renderedContent, headings: articleHeadings } = useArticleMarkdown(computed(() => article.value?.content));
const { activeHeadingId, progressPercent } = useReadingProgress(computed(() => articleHeadings.value.map((heading) => heading.id)));
const authorInitial = computed(() => article.value?.author_name?.slice(0, 1).toUpperCase() || "A");

async function handleLike() {
  if (!authStore.isLoggedIn) {
    uiStore.openAuthModal();
    return;
  }

  try {
    const wasDigged = Boolean(article.value?.is_digg);
    await toggleArticleDigg(articleId.value);
    message.success(wasDigged ? "已取消点赞" : "点赞成功");
    await refreshArticle();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "点赞失败");
  }
}

async function handleFavorite() {
  if (!authStore.isLoggedIn) {
    uiStore.openAuthModal();
    return;
  }
  favoriteModalOpen.value = true;
}

async function resetAndRefreshRootComments() {
  commentsPager.reset(1);
  await commentsPager.loadPage(1, true);
}

async function handleCreateComment(content: string) {
  try {
    await createComment({
      article_id: String(articleId.value),
      content,
      ...(replyTarget.value ? { reply_id: replyTarget.value.id } : {}),
    });
    message.success(replyTarget.value ? "回复已发送" : "评论已发送");
    const repliedRootId = replyTarget.value?.id;
    replyTarget.value = null;
    await resetAndRefreshRootComments();
    if (repliedRootId) {
      resetReplyState(repliedRootId);
      await handleLoadReplies(repliedRootId, true);
    }
    await refreshArticle();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "评论失败");
  }
}

async function handleCommentDigg(commentId: string, isDigg: boolean) {
  try {
    await diggComment(commentId);
    message.success(isDigg ? "已取消评论点赞" : "评论点赞成功");
    await commentsPager.refreshCurrentPage();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "评论点赞失败");
  }
}

async function loadReplyPage(rootId: string, page = 1, force = false) {
  const state = ensureReplyState(rootId);
  if (!force && state.pages[page]) {
    state.currentPage = page;
    replyStates.value = {
      ...replyStates.value,
      [rootId]: state,
    };
    return state.pages[page];
  }

  state.pending = true;
  replyStates.value = {
    ...replyStates.value,
    [rootId]: state,
  };

  try {
    const data = await getReplyComments(articleId.value, rootId, page, REPLY_COMMENT_PAGE_SIZE);
    state.pages = {
      ...state.pages,
      [page]: {
        items: data.list,
        hasMore: data.has_more,
      },
    };
    state.replyCount = data.reply_count;
    state.currentPage = page;
    replyStates.value = {
      ...replyStates.value,
      [rootId]: state,
    };
    return state.pages[page];
  } catch (error) {
    message.error(error instanceof Error ? error.message : "加载回复失败");
    return null;
  } finally {
    state.pending = false;
    replyStates.value = {
      ...replyStates.value,
      [rootId]: state,
    };
  }
}

async function handleLoadReplies(rootId: string, force = false) {
  const state = ensureReplyState(rootId);
  await loadReplyPage(rootId, state.currentPage || 1, force);
}

async function handleNextReplies(rootId: string) {
  const state = ensureReplyState(rootId);
  const current = state.pages[state.currentPage];
  if (!current?.hasMore && !state.pages[state.currentPage + 1]) {
    return;
  }
  await loadReplyPage(rootId, state.currentPage + 1);
}

async function handlePreviousReplies(rootId: string) {
  const state = ensureReplyState(rootId);
  if (state.currentPage <= 1) {
    return;
  }
  await loadReplyPage(rootId, state.currentPage - 1);
}

function handleReply(commentId: string) {
  const target = commentsPager.currentItems.value.find((item) => item.id === commentId);
  if (!target) return;
  replyTarget.value = {
    id: target.id,
    nickname: target.user_nickname,
  };
}

async function handleShare() {
  if (!import.meta.client) return;

  const shareUrl = `${window.location.origin}/article/${articleId.value}`;

  try {
    await navigator.clipboard.writeText(shareUrl);
    message.success("文章链接已复制");
  } catch {
    message.error("复制失败，请手动复制地址栏链接");
  }
}

async function handleFavoriteUpdated() {
  await refreshArticle();
}

const comments = computed(() =>
  commentsPager.currentItems.value.map((comment) => {
    const replyState = replyStates.value[comment.id];
    const currentReplies = replyState?.pages[replyState.currentPage]?.items || [];
    return {
    ...comment,
    replies: currentReplies,
    };
  }),
);

const commentsPending = computed(() => commentsPager.pending.value);
const commentPage = computed(() => commentsPager.currentPage.value);
const commentPagesLoaded = computed(() => Object.keys(commentsPager.pages.value).length);
const hasPreviousCommentPage = computed(() => commentsPager.hasPreviousPage.value);
const hasNextCommentPage = computed(() => commentsPager.hasNextPage.value);
const replyLoading = computed(() =>
  Object.fromEntries(Object.entries(replyStates.value).map(([rootId, state]) => [rootId, state.pending])),
);
const replyPages = computed(() =>
  Object.fromEntries(Object.entries(replyStates.value).map(([rootId, state]) => [rootId, state.currentPage])),
);
const replyHasPrevious = computed(() =>
  Object.fromEntries(Object.entries(replyStates.value).map(([rootId, state]) => [rootId, state.currentPage > 1])),
);
const replyHasNext = computed(() =>
  Object.fromEntries(
    Object.entries(replyStates.value).map(([rootId, state]) => [
      rootId,
      Boolean(state.pages[state.currentPage + 1]) || Boolean(state.pages[state.currentPage]?.hasMore),
    ]),
  ),
);
const replyLoadedPages = computed(() =>
  Object.fromEntries(Object.entries(replyStates.value).map(([rootId, state]) => [rootId, Object.keys(state.pages).length])),
);

async function handlePreviousCommentPage() {
  await commentsPager.goToPreviousPage();
}

async function handleNextCommentPage() {
  await commentsPager.goToNextPage();
}

onMounted(() => {
  markArticleViewed(articleId.value).catch(() => undefined);
});

useSeoMeta({
  title: computed(() => article.value?.title || "文章详情"),
  description: computed(() => article.value?.abstract || "BlogX 文章详情页"),
  ogTitle: computed(() => article.value?.title || "文章详情"),
  ogDescription: computed(() => article.value?.abstract || "BlogX 文章详情页"),
  ogImage: computed(() => article.value?.cover || ""),
});
</script>

<template>
  <div class="page-stack">
    <section v-if="articleLoadError" class="surface-card p-6 md:p-8">
      <div class="eyebrow">Article</div>
      <h1 class="section-title mt-2">文章详情暂不可用</h1>
      <p class="mt-4 text-sm leading-7 muted">
        {{ articleLoadError === "文章不存在" ? "当前文章详情暂不可用，请稍后重试或返回列表选择其他文章。" : articleLoadError }}
      </p>
      <div class="mt-5 flex flex-wrap gap-3">
        <NButton secondary round @click="router.back()">返回上一页</NButton>
        <NuxtLink to="/search" class="glass-badge">返回搜索页</NuxtLink>
      </div>
    </section>

    <template v-else>
    <section class="surface-card p-6 md:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-3xl">
          <div class="mb-4 flex flex-wrap items-center gap-2">
            <NTag round size="small" :bordered="false">{{ article?.category_name || "未分类" }}</NTag>
            <NTag v-for="tag in article?.tags || []" :key="tag" round size="small" :bordered="false">{{ tag }}</NTag>
          </div>
          <h1 class="page-title">{{ article?.title }}</h1>
          <p class="mt-4 text-base leading-8 muted">{{ article?.abstract }}</p>
          <div class="mt-5 flex flex-wrap items-center gap-5 text-sm muted">
            <span>{{ article?.author_name }}</span>
            <span>{{ formatDateTimeLabel(article?.created_at) }}</span>
            <span class="inline-flex items-center gap-1.5"><IconEye :size="16" /> {{ formatCount(article?.view_count || 0) }}</span>
            <span class="inline-flex items-center gap-1.5"><IconThumbUp :size="16" /> {{ formatCount(article?.digg_count || 0) }}</span>
            <span class="inline-flex items-center gap-1.5"><IconHeart :size="16" /> {{ formatCount(article?.favor_count || 0) }}</span>
            <span class="inline-flex items-center gap-1.5"><IconMessageCircle2 :size="16" /> {{ formatCount(article?.comment_count || 0) }}</span>
          </div>
        </div>

        <div class="flex shrink-0 flex-wrap gap-3">
          <NButton secondary round @click="handleLike">
            <template #icon>
              <IconThumbUp :size="18" />
            </template>
            {{ article?.is_digg ? "已点赞" : "点赞" }}
          </NButton>
          <NButton secondary round @click="handleFavorite">
            <template #icon>
              <IconHeart :size="18" />
            </template>
            收藏 {{ formatCount(article?.favor_count || 0) }}
          </NButton>
          <NButton secondary round @click="handleShare">
            <template #icon>
              <IconShare2 :size="18" />
            </template>
            分享
          </NButton>
        </div>
      </div>
    </section>

    <div class="content-grid">
      <div class="page-stack">
        <section class="surface-card overflow-hidden">
          <img v-if="article?.cover" :src="article.cover" :alt="article.title" class="h-[320px] w-full object-cover md:h-[420px]" />
          <div class="p-6 md:p-8">
            <div class="content-prose" v-html="renderedContent" />
          </div>
        </section>

        <section class="surface-card p-5 md:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div class="section-title">评论区</div>
            <div class="glass-badge">{{ formatCount(article?.comment_count || 0) }} 条评论</div>
          </div>

          <CommentComposer
            :loading="commentsPending"
            :title="replyTarget ? `回复 ${replyTarget.nickname}` : '发表评论'"
            :placeholder="replyTarget ? '补充你的回复内容…' : '写下你的看法，帮助更多读者补齐思路。'"
            :submit-label="replyTarget ? '发送回复' : '发表评论'"
            :can-cancel="Boolean(replyTarget)"
            @submit="handleCreateComment"
            @cancel="replyTarget = null"
          />

          <div class="mt-6">
            <CommentThread
              :comments="comments"
              :loading-replies="replyLoading"
              :reply-pages="replyPages"
              :reply-has-previous="replyHasPrevious"
              :reply-has-next="replyHasNext"
              :reply-loaded-pages="replyLoadedPages"
              @reply="handleReply"
              @digg="handleCommentDigg"
              @load-replies="handleLoadReplies"
              @next-replies="handleNextReplies"
              @previous-replies="handlePreviousReplies"
            />
          </div>

          <div
            v-if="comments.length"
            class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-5 text-sm muted"
          >
            <span>评论第 {{ commentPage }} 页，每页 7 条，已加载 {{ commentPagesLoaded }} 页。</span>
            <div class="flex items-center gap-3">
              <NButton quaternary :disabled="!hasPreviousCommentPage" @click="handlePreviousCommentPage">
                上一页
              </NButton>
              <NButton
                type="primary"
                ghost
                :disabled="!hasNextCommentPage"
                :loading="commentsPending"
                @click="handleNextCommentPage"
              >
                下一页
              </NButton>
            </div>
          </div>
        </section>
      </div>

      <aside class="profile-sidebar">
        <div class="article-sidebar-stack">
          <section class="surface-card p-5 md:p-6">
            <div class="eyebrow">Author</div>
            <div class="mt-3 flex items-start gap-4">
              <NAvatar round :size="72" :src="article?.author_avatar || undefined">
                {{ authorInitial }}
              </NAvatar>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="truncate text-[22px] font-semibold tracking-[-0.02em]">{{ article?.author_name }}</div>
                  <span class="glass-badge">文章作者</span>
                </div>
                <p class="mt-1 truncate text-sm muted">@{{ article?.author_username }}</p>
              </div>
            </div>

            <p class="mt-4 text-sm leading-7 muted">
              本文由 {{ article?.author_name }} 发布，文章信息与目录导航会在阅读过程中固定显示，方便随时回到关键信息。
            </p>

            <div class="mt-5 grid gap-3 text-sm">
              <div class="article-author-row">
                <span class="muted">发布时间</span>
                <span>{{ formatDateTimeLabel(article?.created_at) }}</span>
              </div>
              <div class="article-author-row">
                <span class="muted">文章分类</span>
                <span>{{ article?.category_name || "未分类" }}</span>
              </div>
              <div class="article-author-row">
                <span class="muted">评论状态</span>
                <span>{{ article?.comments_toggle ? "允许评论" : "评论关闭" }}</span>
              </div>
              <div class="article-author-row">
                <span class="muted">互动概况</span>
                <span>{{ formatCount(article?.digg_count || 0) }} 赞 · {{ formatCount(article?.comment_count || 0) }} 评</span>
              </div>
            </div>
          </section>

          <ArticleTocAnchor
            :headings="articleHeadings"
            :active-heading-id="activeHeadingId"
            :progress-percent="progressPercent"
          />
        </div>
      </aside>
    </div>
    </template>

    <FavoriteFolderModal
      v-model:show="favoriteModalOpen"
      :article-id="String(articleId)"
      :article-title="article?.title || '当前文章'"
      @updated="handleFavoriteUpdated"
    />
  </div>
</template>
