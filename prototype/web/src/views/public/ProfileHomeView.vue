<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import {
  IconBookmark,
  IconEye,
  IconMessageCircle,
  IconSearch,
  IconSettings,
  IconThumbUp,
} from "@tabler/icons-vue";
import { NAvatar, NButton, NCard, NSpace, NTag } from "naive-ui";

type UserTabKey = "articles" | "favorites" | "diggs" | "following" | "fans";

type ArticleItem = {
  author: string;
  authorId: string;
  avatar: string;
  title: string;
  summary: string;
  time: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  coverClass: string;
};

const userMap = {
  aster: {
    avatar: "AS",
    bio: "视当下为结果，便会绝望；视其为过程，则仍有转机。",
    favoriteFolderCount: 32,
    favoriteTagCount: 86,
    followers: 10,
    following: 4,
    id: "aster",
    joinAt: "2024-10-12",
    nickname: "GentlyBeing",
    stats: {
      comments: 123,
      favorites: 233,
      likes: 43,
      views: 6577,
    },
  },
  louis: {
    avatar: "LO",
    bio: "把系统做稳，把复杂问题拆清楚，再谈体验层的流畅度。",
    favoriteFolderCount: 18,
    favoriteTagCount: 44,
    followers: 7,
    following: 13,
    id: "louis",
    joinAt: "2025-02-08",
    nickname: "Louis",
    stats: {
      comments: 58,
      favorites: 129,
      likes: 17,
      views: 3180,
    },
  },
  river: {
    avatar: "RV",
    bio: "把搜索、消息和内容链路拼起来，让整站体验更顺滑一点。",
    favoriteFolderCount: 24,
    favoriteTagCount: 52,
    followers: 16,
    following: 9,
    id: "river",
    joinAt: "2024-12-01",
    nickname: "River",
    stats: {
      comments: 96,
      favorites: 185,
      likes: 28,
      views: 5124,
    },
  },
} as const;

const route = useRoute();
const activeTab = ref<UserTabKey>("articles");
const articleFilter = ref<"latest" | "hot">("latest");

const tabOptions = [
  { key: "articles" as const, label: "文章" },
  { key: "favorites" as const, label: "收藏" },
  { key: "diggs" as const, label: "点赞" },
  { key: "following" as const, label: "关注" },
  { key: "fans" as const, label: "粉丝" },
];

const articleItems: ArticleItem[] = [
  {
    author: "GentlyBeing",
    authorId: "aster",
    avatar: "AS",
    title: "详解 Nuxt 4，快速上手使用！",
    summary: "Nuxt 4 适合的，不只是“想写 Vue 项目”的场景，而是希望在 Vue 之上直接获得一整套约束和工程默认值。",
    time: "2天前",
    views: 70,
    likes: 3,
    comments: 1,
    tags: ["前端", "JavaScript", "Vue.js"],
    coverClass: "",
  },
  {
    author: "GentlyBeing",
    authorId: "aster",
    avatar: "AS",
    title: "快速了解 Vite，即刻上手使用",
    summary: "Vite 适合解决的，本质上不是“怎么把前端项目跑起来”，而是“怎么让现代前端项目跑得更顺”。",
    time: "2天前",
    views: 59,
    likes: 2,
    comments: 0,
    tags: ["前端", "JavaScript", "Vite"],
    coverClass: "article-cover--warm",
  },
  {
    author: "GentlyBeing",
    authorId: "aster",
    avatar: "AS",
    title: "快速了解 Turborepo，即刻上手使用",
    summary: "Turborepo 简介 Turborepo（简称 Turbo）是由 Vercel 推出的一款高性能 Monorepo 构建系统。",
    time: "4天前",
    views: 62,
    likes: 2,
    comments: 0,
    tags: ["前端", "JavaScript", "前端框架"],
    coverClass: "article-cover--cool",
  },
  {
    author: "GentlyBeing",
    authorId: "aster",
    avatar: "AS",
    title: "免费 HTTPS 证书！使用 Certbot 申请 Let's Encrypt",
    summary: "本文将详细介绍在 Ubuntu 系统中，通过 Certbot 工具申请 Let's Encrypt 免费 HTTPS 证书的完整流程。",
    time: "5天前",
    views: 18,
    likes: 0,
    comments: 0,
    tags: ["后端", "架构"],
    coverClass: "article-cover--violet",
  },
];

const favoriteItems = [
  {
    title: "OpenAPI 先行时的前端页面职责拆分",
    meta: "收藏于《前端架构设计》 · 3 天前",
    summary: "偏重页面结构和数据流，适合作为项目启动阶段的资料。",
  },
  {
    title: "图片上传任务流的前端封装",
    meta: "收藏于《工程化》 · 6 天前",
    summary: "把预去重、直传、complete、轮询拆成统一的上传模型。",
  },
];

const diggItems = [
  {
    title: "SSE 在 AI 编辑器中的流式接入",
    meta: "点赞于昨天 20:24",
    summary: "如何把 stream composable 收成一层，避免页面里到处写事件流拼接逻辑。",
  },
  {
    title: "评论系统消息模型与未读联动",
    meta: "点赞于 04-06 12:18",
    summary: "把评论、回复、楼中楼和消息中心统一到一个用户态增强模型里。",
  },
];

const followingItems = [
  { name: "River", intro: "平台治理 / 搜索链路", stat: "已关注 3 个月", avatar: "RV" },
  { name: "Louis", intro: "运维后台 / 数据看板", stat: "已关注 1 个月", avatar: "LO" },
];

const fanItems = [
  { name: "Cedar", intro: "前端工程化 / 文档体验", stat: "关注了你 2 天", avatar: "CD" },
  { name: "Mina", intro: "AI 搜索 / 内容社区", stat: "关注了你 1 周", avatar: "MN" },
];

const profileUser = computed(() => {
  const key = String(route.params.id || "aster").toLowerCase() as keyof typeof userMap;
  return userMap[key] ?? userMap.aster;
});

const renderedArticles = computed(() =>
  articleFilter.value === "latest" ? articleItems : [...articleItems].sort((a, b) => b.likes + b.views - (a.likes + a.views)),
);

const currentArticles = computed(() => renderedArticles.value);
const currentCollections = computed(() => (activeTab.value === "favorites" ? favoriteItems : diggItems));
const currentRelations = computed(() => (activeTab.value === "following" ? followingItems : fanItems));
</script>

<template>
  <div class="profile-home-layout">
    <div class="profile-home-main">
      <NSpace vertical :size="20">
        <NCard class="profile-home-hero" size="large">
          <div class="profile-home-hero__layout">
            <div class="profile-home-hero__identity">
              <NAvatar round :size="88">{{ profileUser.avatar }}</NAvatar>
              <div class="profile-home-hero__copy">
                <h2>{{ profileUser.nickname }}</h2>
                <p class="muted">{{ profileUser.bio }}</p>
              </div>
            </div>
            <RouterLink to="/studio/settings">
              <NButton class="profile-home-hero__action" secondary>
                <template #icon><IconSettings :size="18" /></template>
                设置
              </NButton>
            </RouterLink>
          </div>
        </NCard>

        <NCard size="large" class="profile-home-content-card">
          <div class="profile-home-tabs">
            <div class="profile-home-tabs__nav">
              <button
                v-for="item in tabOptions"
                :key="item.key"
                type="button"
                class="profile-home-tab"
                :class="{ 'profile-home-tab--active': activeTab === item.key }"
                @click="activeTab = item.key"
              >
                {{ item.label }}
              </button>
            </div>
            <button type="button" class="profile-home-tabs__search">
              <IconSearch :size="18" />
            </button>
          </div>

          <template v-if="activeTab === 'articles'">
            <div class="profile-home-filter-row">
              <button
                type="button"
                class="profile-home-filter"
                :class="{ 'profile-home-filter--active': articleFilter === 'latest' }"
                @click="articleFilter = 'latest'"
              >
                最新
              </button>
              <button
                type="button"
                class="profile-home-filter"
                :class="{ 'profile-home-filter--active': articleFilter === 'hot' }"
                @click="articleFilter = 'hot'"
              >
                热门
              </button>
            </div>

            <div class="profile-home-feed profile-home-feed--cards">
              <NCard v-for="article in currentArticles" :key="article.title" embedded class="home-article-card">
                <div class="home-article-card__layout">
                  <RouterLink to="/article/demo" class="home-article-link home-article-cover-link home-article-cover-link--feed">
                    <div class="article-cover home-article-cover" :class="article.coverClass" />
                  </RouterLink>
                  <div class="home-article-card__content">
                    <RouterLink to="/article/demo" class="home-article-link">
                      <h3 class="home-article-title">{{ article.title }}</h3>
                    </RouterLink>
                    <RouterLink to="/article/demo" class="home-article-link">
                      <p class="muted home-article-summary">{{ article.summary }}</p>
                    </RouterLink>
                    <div class="section-gap home-article-meta">
                      <div class="home-article-meta__left">
                        <RouterLink :to="`/users/${article.authorId}`" class="home-article-author-link">
                          <NSpace size="small" align="center" class="home-article-meta__group">
                            <NAvatar size="small" round>{{ article.avatar }}</NAvatar>
                            <span>{{ article.author }}</span>
                          </NSpace>
                        </RouterLink>
                        <NSpace size="small" wrap class="home-article-meta__tags">
                          <NTag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</NTag>
                        </NSpace>
                      </div>
                      <div class="home-article-meta__stats">
                        <span class="home-article-stat">
                          <IconThumbUp :size="16" />
                          <span>{{ article.likes }}</span>
                        </span>
                        <span class="home-article-stat">
                          <IconEye :size="16" />
                          <span>{{ article.views }}</span>
                        </span>
                        <span class="home-article-stat">
                          <IconMessageCircle :size="16" />
                          <span>{{ article.comments }}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </NCard>
            </div>
          </template>

          <template v-else-if="activeTab === 'favorites' || activeTab === 'diggs'">
            <div class="profile-home-collection-list">
              <article v-for="item in currentCollections" :key="item.title" class="profile-home-collection-item">
                <RouterLink to="/article/demo" class="profile-home-collection-item__title">{{ item.title }}</RouterLink>
                <p class="muted">{{ item.summary }}</p>
                <span class="muted profile-home-collection-item__meta">{{ item.meta }}</span>
              </article>
            </div>
          </template>

          <template v-else>
            <div class="profile-home-user-list">
              <article v-for="item in currentRelations" :key="item.name" class="profile-home-user-card">
                <div class="profile-home-user-card__identity">
                  <NAvatar round>{{ item.avatar }}</NAvatar>
                  <div>
                    <strong>{{ item.name }}</strong>
                    <p class="muted">{{ item.intro }}</p>
                  </div>
                </div>
                <span class="muted">{{ item.stat }}</span>
              </article>
            </div>
          </template>
        </NCard>
      </NSpace>
    </div>

    <aside class="profile-home-side">
      <NSpace vertical :size="20">
        <NCard title="个人成就" size="large">
          <div class="profile-home-side-list">
            <div class="profile-home-side-item">
              <span class="profile-home-side-item__icon"><IconThumbUp :size="16" /></span>
              <span>文章被点赞 {{ profileUser.stats.likes }}</span>
            </div>
            <div class="profile-home-side-item">
              <span class="profile-home-side-item__icon"><IconEye :size="16" /></span>
              <span>文章被阅读 {{ profileUser.stats.views.toLocaleString() }}</span>
            </div>
            <div class="profile-home-side-item">
              <span class="profile-home-side-item__icon"><IconBookmark :size="16" /></span>
              <span>文章被收藏 {{ profileUser.stats.favorites }}</span>
            </div>
            <div class="profile-home-side-item">
              <span class="profile-home-side-item__icon"><IconMessageCircle :size="16" /></span>
              <span>文章被评论 {{ profileUser.stats.comments }}</span>
            </div>
          </div>
        </NCard>

        <NCard size="large">
          <div class="profile-home-side-grid">
            <div class="profile-home-side-grid__item">
              <span class="muted">关注了</span>
              <strong>{{ profileUser.following }}</strong>
            </div>
            <div class="profile-home-side-grid__item">
              <span class="muted">关注者</span>
              <strong>{{ profileUser.followers }}</strong>
            </div>
          </div>
        </NCard>

        <NCard size="large">
          <div class="profile-home-side-meta">
            <div class="profile-home-side-meta__row">
              <span>收藏集</span>
              <strong>{{ profileUser.favoriteFolderCount }}</strong>
            </div>
            <div class="profile-home-side-meta__row">
              <span>关注标签</span>
              <strong>{{ profileUser.favoriteTagCount }}</strong>
            </div>
            <div class="profile-home-side-meta__row">
              <span>加入于</span>
              <strong>{{ profileUser.joinAt }}</strong>
            </div>
          </div>
        </NCard>
      </NSpace>
    </aside>
  </div>
</template>
