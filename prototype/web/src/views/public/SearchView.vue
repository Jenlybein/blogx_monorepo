<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { IconEye, IconMessageCircle, IconStar, IconThumbUp } from "@tabler/icons-vue";
import { NAvatar, NButton, NCard, NInput, NSelect, NSpace, NTag } from "naive-ui";

const searchKey = ref("OpenAPI 驱动的前端架构设计");
const searchSort = ref("1");
const selectedTag = ref("architecture");

const searchType = "4";

const sortOptions = [
  { label: "最相关", value: "1" },
  { label: "最新发布", value: "2" },
  { label: "最多点赞", value: "3" },
  { label: "最多收藏", value: "4" },
];

const tagOptions = [
  { label: "全部标签", value: "all" },
  { label: "架构设计", value: "architecture" },
  { label: "工程化", value: "engineering" },
  { label: "后端协作", value: "backend" },
  { label: "性能优化", value: "performance" },
  { label: "测试体系", value: "testing" },
];

const resultList = [
  {
    author: "Aster",
    authorId: "aster",
    avatar: "AS",
    comments: 18,
    coverClass: "",
    digg: 126,
    favor: 64,
    summary: "强调页面职责、列表与详情状态边界、service/composable/store 的拆法，以及如何避免过度抽象。",
    tags: ["架构设计", "OpenAPI", "Nuxt"],
    title: "接口既定时，前端该如何反向设计页面结构",
  },
  {
    author: "River",
    authorId: "river",
    avatar: "RV",
    comments: 9,
    coverClass: "article-cover--warm",
    digg: 88,
    favor: 41,
    summary: "围绕上传任务、图片状态、轮询机制与失败重试，把媒体能力统一收敛成一层前端调用模型。",
    tags: ["工具实践", "上传任务", "轮询"],
    title: "从接口约束推导编辑器与媒体上传方案",
  },
  {
    author: "Louis",
    authorId: "louis",
    avatar: "LO",
    comments: 12,
    coverClass: "article-cover--cool",
    digg: 73,
    favor: 39,
    summary: "围绕审核、日志、用户管理和站点配置，把后台模块按业务域切开，而不是按组件类型堆文件夹。",
    tags: ["后台架构", "审核", "日志中心"],
    title: "为什么后台系统更需要按业务域拆模块",
  },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="筛选条件" size="large" class="search-filter-card">
      <div class="search-filter-grid">
        <div class="search-filter-field search-filter-field--wide">
          <label class="search-filter-label">关键字（key）</label>
          <NInput v-model:value="searchKey" placeholder="搜索关键字或查询词" clearable />
        </div>
        <div class="search-filter-field">
          <label class="search-filter-label">标签列表（tag_list）</label>
          <NSelect v-model:value="selectedTag" :options="tagOptions" />
        </div>
        <div class="search-filter-field">
          <label class="search-filter-label">排序参数（sort）</label>
          <NSelect v-model:value="searchSort" :options="sortOptions" />
        </div>
      </div>

      <p class="muted search-filter-hint">`type` 为前端内部提交参数，按当前搜索场景固定写入，不对用户直接展示。</p>

      <div class="search-filter-actions">
        <NButton type="primary">搜索</NButton>
        <NButton quaternary>重置</NButton>
      </div>
    </NCard>

    <NCard :title="`共 ${resultList.length * 62} 条结果`" size="large">
      <div class="search-results-list">
        <NCard v-for="article in resultList" :key="article.title" embedded class="home-article-card">
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
                  <span class="home-article-stat">
                    <IconEye :size="16" />
                    <span>命中</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </NCard>
      </div>
    </NCard>
  </NSpace>
</template>
