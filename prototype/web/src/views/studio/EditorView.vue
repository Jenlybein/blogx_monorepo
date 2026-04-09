<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { NButton, NCard, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";

const myArticles = [
  {
    title: "基于既有 OpenAPI 反向设计前端架构",
    summary: "从页面结构、组件拆分、状态设计到 API Integration Design，完整走一遍前端反推方案。",
    status: "已发布",
    statusType: "success" as const,
    stats: "12.6k 阅读 · 436 点赞 · 128 收藏",
    updatedAt: "今天 10:24",
  },
  {
    title: "评论系统的楼中楼与消息联动设计",
    summary: "把评论树、消息提醒、未读计数和路由进入状态统一在一套前端数据流里。",
    status: "草稿",
    statusType: "warning" as const,
    stats: "草稿保存 7 次 · 最近自动保存于 14:08",
    updatedAt: "今天 14:08",
  },
  {
    title: "图片上传任务流的前端封装",
    summary: "围绕 hash、创建任务、直传、complete 和轮询状态，整理上传模块的职责边界。",
    status: "待审核",
    statusType: "info" as const,
    stats: "2.4k 阅读 · 83 点赞 · 41 收藏",
    updatedAt: "昨天 20:11",
  },
  {
    title: "SSE 在 AI 写作场景中的接入方式",
    summary: "如何在前端抽象 stream composable，并处理取消、错误、重连与内容拼接。",
    status: "已发布",
    statusType: "success" as const,
    stats: "8.7k 阅读 · 274 点赞 · 96 收藏",
    updatedAt: "04-07 18:32",
  },
];

const filters = ["全部", "草稿", "已发布", "待审核"] as const;
const currentFilter = ref<(typeof filters)[number]>("全部");

const filteredArticles = computed(() =>
  currentFilter.value === "全部" ? myArticles : myArticles.filter((article) => article.status === currentFilter.value),
);
</script>

<template>
  <NSpace vertical :size="20">
    <NCard>
      <template #header>
        <div class="article-list-header">
          <div class="article-list-header__left">
            <h2 class="article-list-header__title">我的全部文章</h2>
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
          <RouterLink to="/studio/write">
            <NButton type="primary">创作文章</NButton>
          </RouterLink>
        </div>
      </template>
      <NList>
        <NListItem v-for="article in filteredArticles" :key="article.title">
          <NThing :title="article.title" :description="article.summary">
            <template #header-extra>
              <NTag :type="article.statusType">{{ article.status }}</NTag>
            </template>
            <template #footer>
              <div class="profile-article-meta">
                <span>{{ article.stats }}</span>
                <span>{{ article.updatedAt }}</span>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <NSpace>
              <NButton size="small" quaternary>查看</NButton>
              <NButton size="small" quaternary>编辑</NButton>
            </NSpace>
          </template>
        </NListItem>
      </NList>
    </NCard>
  </NSpace>
</template>
