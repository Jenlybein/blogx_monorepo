<script setup lang="ts">
import { IconMessageCircle, IconStar, IconThumbUp } from "@tabler/icons-vue";
import {
  NAvatar,
  NCard,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NSpace,
  NTag,
  NThing,
} from "naive-ui";

const pinnedArticles = [
  {
    desc: "适合对齐现有接口能力与页面职责，覆盖首页、工作台、后台三套信息架构。",
    hot: "15.8k 阅读",
    title: "接口先行时，前端如何从 OpenAPI 反向设计博客平台",
  },
  {
    desc: "围绕根评论、回复分页、用户态增强字段和交互反馈做完整拆解。",
    hot: "9.4k 阅读",
    title: "评论系统的根评论 / 回复分页策略",
  },
];

const articleList = [
  {
    author: "Aster",
    authorId: "aster",
    avatar: "AS",
    comments: 18,
    coverClass: "",
    digg: 126,
    favor: 64,
    summary: "展示站点、工作台、后台三套页面如何围绕现有接口能力拆分，重点是 API Integration Design 和状态边界。",
    tags: ["架构设计", "OpenAPI", "Nuxt"],
    title: "把 OpenAPI 作为前端架构输入：从接口反推页面与数据流",
  },
  {
    author: "River",
    authorId: "river",
    avatar: "RV",
    comments: 9,
    coverClass: "article-cover--warm",
    digg: 88,
    favor: 41,
    summary: "适合 Nuxt 类站点，讨论公共缓存、鉴权增强字段和页面懒加载的拆分方式。",
    tags: ["性能优化", "SSR", "缓存策略"],
    title: "SSR 场景下的缓存策略：页面数据、用户态增强与静态区块如何共存",
  },
  {
    author: "Louis",
    authorId: "louis",
    avatar: "LO",
    comments: 12,
    coverClass: "article-cover--cool",
    digg: 73,
    favor: 39,
    summary: "从任务创建、直传、完成确认到状态轮询，把图片上传组件统一成一套稳定心智模型。",
    tags: ["工程化", "上传", "任务流"],
    title: "图片上传任务流：预去重、直传、完成确认、状态轮询",
  },
];
</script>

<template>
  <NGrid class="home-layout" :cols="24" :x-gap="20" responsive="screen">
    <NGridItem :span="16">
      <NSpace vertical :size="20">
        <NCard class="home-banner-card" :bordered="false" size="large">
          <div class="home-banner-stage">
            <button class="home-banner-switcher__arrow home-banner-switcher__arrow--overlay" type="button">‹</button>
            <div class="home-banner-image" />
            <button class="home-banner-switcher__arrow home-banner-switcher__arrow--overlay" type="button">›</button>
          </div>
          <div class="home-banner-switcher" aria-label="banner switcher">
            <span class="home-banner-switcher__dot home-banner-switcher__dot--active" />
            <span class="home-banner-switcher__dot" />
            <span class="home-banner-switcher__dot" />
          </div>
        </NCard>

        <NCard v-if="pinnedArticles.length" title="热门置顶" size="large">
          <NList hoverable>
            <NListItem v-for="item in pinnedArticles" :key="item.title">
              <NThing :title="item.title" :description="item.desc" />
              <template #suffix><NTag>{{ item.hot }}</NTag></template>
            </NListItem>
          </NList>
        </NCard>

        <NCard title="文章列表" size="large">
          <NSpace vertical :size="16">
            <NCard v-for="article in articleList" :key="article.title" embedded class="home-article-card">
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
                        <span>{{ article.digg }}</span>
                      </span>
                      <span class="home-article-stat">
                        <IconStar :size="16" />
                        <span>{{ article.favor }}</span>
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
          </NSpace>
        </NCard>
      </NSpace>
    </NGridItem>

    <NGridItem :span="8">
      <NCard class="home-sidebar" title="右边栏" size="large">
        <NSpace vertical :size="18">
          <NCard embedded title="站点公告">
            <p class="muted">公告、活动位、专题推荐和快捷入口统一留在右边栏，避免打散主阅读区节奏。</p>
          </NCard>
          <NCard embedded title="热门标签">
            <NSpace>
              <NTag>Nuxt</NTag>
              <NTag>TypeScript</NTag>
              <NTag>Monorepo</NTag>
              <NTag>OpenAPI</NTag>
            </NSpace>
          </NCard>
          <NCard embedded title="推荐作者">
            <NList>
              <NListItem>
                <NThing title="Aster" description="前端架构 / 文档体验" />
                <template #prefix><NAvatar>AS</NAvatar></template>
              </NListItem>
              <NListItem>
                <NThing title="River" description="平台治理 / 搜索链路" />
                <template #prefix><NAvatar>RV</NAvatar></template>
              </NListItem>
              <NListItem>
                <NThing title="Louis" description="可观测性 / 运营后台" />
                <template #prefix><NAvatar>LO</NAvatar></template>
              </NListItem>
            </NList>
          </NCard>
        </NSpace>
      </NCard>
    </NGridItem>
  </NGrid>
</template>
