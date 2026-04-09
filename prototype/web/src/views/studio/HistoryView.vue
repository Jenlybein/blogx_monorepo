<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { NButton, NCard, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";

const historyArticles = [
  {
    title: "OpenAPI 驱动下的前端页面职责拆分",
    summary: "从接口能力反推页面边界，把首页、详情、工作台和后台拆成真正可维护的模块结构。",
    bucket: "今天",
    bucketType: "primary" as const,
    source: "来自首页推荐",
    stats: "继续阅读进度 68% · 停留 12 分钟",
    visitedAt: "今天 10:42",
  },
  {
    title: "评论系统消息模型与未读联动设计",
    summary: "把评论、回复、楼中楼和消息中心统一到用户态增强模型里，减少前端重复拼装状态。",
    bucket: "今天",
    bucketType: "primary" as const,
    source: "来自消息中心",
    stats: "已读完 · 收藏 1 次 · 评论区停留 6 分钟",
    visitedAt: "今天 08:16",
  },
  {
    title: "图片上传任务流：预去重、直传、完成确认、状态轮询",
    summary: "围绕 hash、创建任务、直传、complete 与轮询状态，整理上传模块职责边界。",
    bucket: "近 7 天",
    bucketType: "info" as const,
    source: "来自搜索结果",
    stats: "继续阅读进度 34% · 最近回访 2 次",
    visitedAt: "昨天 22:11",
  },
  {
    title: "SSE 在 AI 写作场景中的接入方式",
    summary: "如何抽象 stream composable，并处理取消、错误、重连与内容拼接。",
    bucket: "更早",
    bucketType: "default" as const,
    source: "来自个人收藏",
    stats: "已读完 · 上次阅读于 04-05 19:26",
    visitedAt: "04-05 19:26",
  },
];

const filters = ["全部", "今天", "近 7 天", "更早"] as const;
const currentFilter = ref<(typeof filters)[number]>("全部");

const filteredArticles = computed(() =>
  currentFilter.value === "全部" ? historyArticles : historyArticles.filter((article) => article.bucket === currentFilter.value),
);
</script>

<template>
  <NSpace vertical :size="20">
    <NCard>
      <template #header>
        <div class="article-list-header">
          <div class="article-list-header__left">
            <h2 class="article-list-header__title">浏览历史</h2>
            <NSpace>
              <NButton
                v-for="filter in filters"
                :key="filter"
                size="small"
                :type="currentFilter === filter ? 'primary' : 'default'"
                secondary
                @click="currentFilter = filter"
              >
                {{ filter }}
              </NButton>
            </NSpace>
          </div>
          <RouterLink to="/search">
            <NButton quaternary>继续浏览</NButton>
          </RouterLink>
        </div>
      </template>

      <NList>
        <NListItem v-for="article in filteredArticles" :key="article.title">
          <NThing :title="article.title" :description="article.summary">
            <template #header-extra>
              <NSpace size="small">
                <NTag :type="article.bucketType">{{ article.bucket }}</NTag>
                <NTag>{{ article.source }}</NTag>
              </NSpace>
            </template>
            <template #footer>
              <div class="profile-article-meta">
                <span>{{ article.stats }}</span>
                <span>{{ article.visitedAt }}</span>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <NSpace>
              <RouterLink to="/article/demo">
                <NButton size="small" quaternary>继续阅读</NButton>
              </RouterLink>
              <NButton size="small" quaternary>移出历史</NButton>
            </NSpace>
          </template>
        </NListItem>
      </NList>
    </NCard>
  </NSpace>
</template>
