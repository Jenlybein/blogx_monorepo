<script setup lang="ts">
import { NButton, NCard, NList, NListItem, NThing } from "naive-ui";
import { getOwnArticles } from "~/services/article";
import { getOwnFavoriteFolders } from "~/services/favorite";
import { getManageComments, getHistoryArticles } from "~/services/studio";
import { getSelfUserDetail, getMessageSummary } from "~/services/user";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const { data, refresh } = await useAsyncData("studio-dashboard", async () => {
  const [user, summary, articles, favorites, history, comments] = await Promise.all([
    getSelfUserDetail(),
    getMessageSummary(),
    getOwnArticles({ page: 1, limit: 100 }),
    getOwnFavoriteFolders(),
    getHistoryArticles({ type: 1 }),
    getManageComments({ type: 1, page: 1, limit: 5 }),
  ]);

  const articleByStatus = articles.list.reduce<Record<number, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    user,
    summary,
    articleCount: articles.count,
    articleByStatus,
    favoritesCount: favorites.count,
    historyCount: history.count,
    comments,
  };
});

const metrics = computed(() => [
  { label: "文章总量", value: data.value?.articleCount ?? 0, note: "当前账号在 web 端可管理的全部文章" },
  { label: "草稿", value: data.value?.articleByStatus[1] ?? 0, note: "继续编辑或补资料后再发布" },
  { label: "待审核", value: data.value?.articleByStatus[2] ?? 0, note: "等待审核通过后进入公开流" },
  { label: "已发布", value: data.value?.articleByStatus[3] ?? 0, note: "会出现在公开页与搜索结果里" },
  { label: "收藏夹", value: data.value?.favoritesCount ?? 0, note: "我的分组总数" },
  { label: "浏览历史", value: data.value?.historyCount ?? 0, note: "最近阅读痕迹数量" },
  {
    label: "未读消息",
    value:
      (data.value?.summary.comment_msg_count ?? 0) +
      (data.value?.summary.digg_favor_msg_count ?? 0) +
      (data.value?.summary.private_msg_count ?? 0) +
      (data.value?.summary.system_msg_count ?? 0),
    note: "评论、互动、私信与系统通知的聚合值",
  },
  { label: "站龄", value: data.value?.user.code_age ?? 0, note: "来自 users/detail.code_age" },
]);

useSeoMeta({
  title: "个人中心 - 数据概览",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="数据概览"
      description="把文章状态、互动、收藏和消息摘要收拢到一个工作台入口，便于快速判断今天该继续写什么、回什么、清什么。"
      eyebrow="Overview"
    >
      <NButton type="primary" @click="refresh()">刷新概览</NButton>
    </StudioPageHeader>

    <section class="studio-metric-grid">
      <NCard v-for="item in metrics" :key="item.label" class="studio-metric-card" :bordered="false">
        <div class="muted text-sm">{{ item.label }}</div>
        <div class="mt-3 text-3xl font-semibold tracking-[-0.04em]">{{ item.value }}</div>
        <p class="mt-2 text-sm leading-6 muted">{{ item.note }}</p>
      </NCard>
    </section>

    <div class="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <section class="studio-list-card">
        <div class="studio-toolbar">
          <div>
            <div class="eyebrow">Recent</div>
            <h2 class="section-title mt-2">最近待处理评论</h2>
          </div>
          <NuxtLink to="/studio/comments" class="glass-badge">进入评论管理</NuxtLink>
        </div>

        <NList v-if="data?.comments.list.length">
          <NListItem v-for="item in data?.comments.list" :key="item.id">
            <NThing :title="item.article_title" :description="item.content">
              <template #footer>
                <div class="studio-list-meta">
                  <span>{{ item.user_nickname }}</span>
                  <span>{{ formatDateTimeLabel(item.created_at) }}</span>
                  <span>{{ item.reply_count }} 条回复</span>
                </div>
              </template>
            </NThing>
          </NListItem>
        </NList>
        <StudioEmptyState
          v-else
          title="还没有待处理评论"
          description="评论区暂时很安静，等读者开始互动后这里会出现最新记录。"
        />
      </section>

      <section class="studio-list-card">
        <div class="studio-toolbar">
          <div>
            <div class="eyebrow">Message</div>
            <h2 class="section-title mt-2">消息摘要</h2>
          </div>
          <NuxtLink to="/studio/inbox" class="glass-badge">打开消息中心</NuxtLink>
        </div>

        <div class="mt-5 space-y-4">
          <div class="sidebar-list-row">
            <span class="muted">评论与回复</span>
            <strong>{{ data?.summary.comment_msg_count ?? 0 }}</strong>
          </div>
          <div class="sidebar-list-row line-divider">
            <span class="muted">点赞与收藏</span>
            <strong>{{ data?.summary.digg_favor_msg_count ?? 0 }}</strong>
          </div>
          <div class="sidebar-list-row line-divider">
            <span class="muted">私信消息</span>
            <strong>{{ data?.summary.private_msg_count ?? 0 }}</strong>
          </div>
          <div class="sidebar-list-row line-divider">
            <span class="muted">系统通知</span>
            <strong>{{ data?.summary.system_msg_count ?? 0 }}</strong>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
