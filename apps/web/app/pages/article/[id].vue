<script setup lang="ts">
import MarkdownIt from "markdown-it";
import { computed, onMounted, ref } from "vue";
import { IconEye, IconHeart, IconMessageCircle2, IconShare2, IconThumbUp } from "@tabler/icons-vue";
import { NAvatar, NButton, NTag, useMessage } from "naive-ui";
import { favoriteArticle, getArticleDetail, markArticleViewed, toggleArticleDigg } from "~/services/article";
import { createComment, diggComment, getReplyComments, getRootComments } from "~/services/comment";
import { formatCount, formatDateTimeLabel } from "~/utils/format";

const route = useRoute();
const articleId = computed(() => route.params.id as string);
const authStore = useAuthStore();
const uiStore = useUiStore();
const message = useMessage();

const markdown = new MarkdownIt({
  breaks: true,
  linkify: true,
  html: false,
});

const { data: article, refresh: refreshArticle } = await useAsyncData(
  () => `article-${articleId.value}`,
  () => getArticleDetail(articleId.value),
);

const {
  data: rootComments,
  pending: commentsPending,
  refresh: refreshComments,
} = await useAsyncData(
  () => `article-comments-${articleId.value}`,
  () => getRootComments(articleId.value).catch(() => ({ list: [], has_more: false })),
);

const replyMap = ref<Record<string, Awaited<ReturnType<typeof getReplyComments>>["list"]>>({});
const replyLoading = ref<Record<string, boolean>>({});
const replyTarget = ref<{ id: string; nickname: string } | null>(null);

const renderedContent = computed(() =>
  article.value?.content ? markdown.render(article.value.content) : "<p>暂无正文内容。</p>",
);

async function handleLike() {
  if (!authStore.isLoggedIn) {
    uiStore.openAuthModal();
    return;
  }

  try {
    await toggleArticleDigg(articleId.value);
    message.success("已更新点赞状态");
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

  try {
    await favoriteArticle(articleId.value);
    message.success("已尝试加入收藏夹");
    await refreshArticle();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "收藏失败");
  }
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
    await refreshComments();
    if (repliedRootId) {
      delete replyMap.value[repliedRootId];
      await handleLoadReplies(repliedRootId);
    }
    await refreshArticle();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "评论失败");
  }
}

async function handleCommentDigg(commentId: string) {
  try {
    await diggComment(commentId);
    message.success("评论点赞已更新");
    await refreshComments();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "评论点赞失败");
  }
}

async function handleLoadReplies(rootId: string) {
  replyLoading.value[rootId] = true;
  try {
    const data = await getReplyComments(articleId.value, rootId, 1, 10);
    replyMap.value[rootId] = data.list;
  } catch (error) {
    message.error(error instanceof Error ? error.message : "加载回复失败");
  } finally {
    replyLoading.value[rootId] = false;
  }
}

function handleReply(commentId: string) {
  const target = (rootComments.value?.list || []).find((item) => item.id === commentId);
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

const comments = computed(() =>
  (rootComments.value?.list || []).map((comment) => ({
    ...comment,
    replies: replyMap.value[comment.id] || [],
  })),
);

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
              @reply="handleReply"
              @digg="handleCommentDigg"
              @load-replies="handleLoadReplies"
            />
          </div>
        </section>
      </div>

      <aside class="profile-sidebar">
        <section class="surface-card p-5 md:p-6">
          <div class="mb-4 flex items-center gap-3">
            <NAvatar round :size="56" :src="article?.author_avatar || undefined">
              {{ article?.author_name?.slice(0, 1).toUpperCase() }}
            </NAvatar>
            <div>
              <div class="text-lg font-semibold">{{ article?.author_name }}</div>
              <p class="text-sm muted">@{{ article?.author_username }}</p>
            </div>
          </div>
          <p class="text-sm leading-7 muted">
            这块作者信息目前严格按文章详情接口展示。等后端在详情接口补上作者 id 后，这里再直接串作者主页跳转会更稳。
          </p>
        </section>
      </aside>
    </div>
  </div>
</template>
