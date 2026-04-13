<script setup lang="ts">
import ArticleFeedItem from "~/components/article/ArticleFeedItem.vue";
import BannerCarousel from "~/components/article/BannerCarousel.vue";
import HomeSidebar from "~/components/home/HomeSidebar.vue";
import { shallowRef } from "vue";
import { getTopArticles } from "~/services/article";
import { searchArticles } from "~/services/search";
import { getBannerList } from "~/services/site";
import { formatCount } from "~/utils/format";

const siteStore = useSiteStore();
const topRequestError = shallowRef<unknown>(null);
const latestRequestError = shallowRef<unknown>(null);

function formatRequestError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

const { data: bannerData } = await useAsyncData("home-banners", () =>
  getBannerList().catch(() => ({ list: [], has_more: false })),
);
const { data: topData } = await useAsyncData("home-top-articles", async () => {
  try {
    topRequestError.value = null;
    return await getTopArticles();
  } catch (error) {
    topRequestError.value = error;
    console.error(`[home-top-articles] request failed: ${formatRequestError(error)}`);
    return { list: [], count: 0 };
  }
},
);
const { data: latestData, pending: latestPending } = await useAsyncData("home-latest-articles", async () => {
  try {
    latestRequestError.value = null;
    return await searchArticles({
      type: 1,
      page: 1,
      limit: 10,
      page_mode: "count",
      sort: 2,
    });
  } catch (error) {
    latestRequestError.value = error;
    console.error(`[home-latest-articles] request failed: ${formatRequestError(error)}`);
    return { list: [], pagination: { mode: "count", page: 1, limit: 10, has_more: false, total: 0, total_pages: 0 } };
  }
},
);

useSeoMeta({
  title: siteStore.seo?.site_title || "BlogX",
  description: siteStore.seo?.description || "开发者内容平台",
  keywords: siteStore.seo?.keywords || "前端, Nuxt, Vue, OpenAPI",
  ogTitle: siteStore.seo?.site_title || "BlogX",
  ogDescription: siteStore.seo?.description || "开发者内容平台",
});

const banners = computed(() => bannerData.value?.list || []);
const topArticles = computed(() => topData.value?.list || []);
const latestArticles = computed(() => latestData.value?.list || []);
</script>

<template>
  <div class="page-stack">
    <div class="hero-grid">
      <div class="page-stack">
        <BannerCarousel :banners="banners" />

        <section v-if="topArticles.length" class="surface-card p-5 md:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <div class="eyebrow">Pinned</div>
              <h2 class="section-title mt-2">热门置顶</h2>
            </div>
            <div class="glass-badge">{{ topArticles.length }} 篇</div>
          </div>

          <div class="space-y-4">
            <div
              v-for="article in topArticles"
              :key="article.id"
              class="line-divider pt-4 first:border-0 first:pt-0"
            >
              <NuxtLink :to="`/article/${article.id}`" class="block">
                <div class="text-lg font-semibold">{{ article.title }}</div>
                <p class="mt-2 text-sm leading-7 muted">{{ article.abstract }}</p>
                <div class="mt-3 flex flex-wrap items-center gap-3 text-sm muted">
                  <span>{{ article.user_nickname }}</span>
                  <span>{{ article.category_title }}</span>
                  <span>{{ formatCount(article.view_count) }} 阅读</span>
                </div>
              </NuxtLink>
            </div>
          </div>
        </section>

        <section class="surface-card p-5 md:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <div class="eyebrow">Latest</div>
              <h2 class="section-title mt-2">最新文章</h2>
            </div>
            <NuxtLink to="/search" class="glass-badge">进入搜索</NuxtLink>
          </div>

          <div v-if="latestArticles.length" class="space-y-4">
            <ArticleFeedItem
              v-for="article in latestArticles"
              :key="article.id"
              :article="article"
              compact
            />
          </div>
          <div v-else class="surface-section flex min-h-[220px] items-center justify-center p-6 text-sm muted">
            {{
              latestPending
                ? "正在加载文章流..."
                : latestRequestError
                  ? "文章加载失败，请检查前端 API 地址或测试环境状态。"
                  : "暂时没有可展示的公开文章。"
            }}
          </div>
        </section>
      </div>

      <HomeSidebar
        :runtime-config="siteStore.runtimeConfig"
        :ai-info="siteStore.aiInfo"
        :articles="latestArticles"
      />
    </div>
  </div>
</template>
