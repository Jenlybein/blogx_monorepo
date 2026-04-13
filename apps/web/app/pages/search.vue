<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { NButton, NInput } from "naive-ui";
import ArticleFeedItem from "~/components/article/ArticleFeedItem.vue";
import { getTagOptions, searchArticles } from "~/services/search";

const route = useRoute();
const router = useRouter();

useSeoMeta({
  title: "搜索文章",
  description: "按关键词、标签与排序方式搜索公开文章。",
});

const key = ref("");
const sort = ref("1");
const tagId = ref("");
const page = ref(1);
const requestError = shallowRef<unknown>(null);

watch(
  () => route.query,
  (query) => {
    key.value = typeof query.key === "string" ? query.key : "";
    sort.value = typeof query.sort === "string" ? query.sort : "1";
    tagId.value = typeof query.tag_ids === "string" ? query.tag_ids : "";
    page.value = typeof query.page === "string" && query.page ? Number(query.page) : 1;
  },
  { immediate: true },
);

const { data: tagOptions } = await useAsyncData("search-tags", () => getTagOptions().catch(() => []));

function formatRequestError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

const searchPager = await usePagedResourceCache({
  cacheKey: () =>
    `search:${JSON.stringify({
      key: key.value.trim(),
      sort: sort.value,
      tag_ids: tagId.value,
    })}`,
  pageSize: () => 9,
  initialPage: () => page.value,
  fetchPage: async (nextPage, limit) => {
    try {
      requestError.value = null;
      const payload = await searchArticles({
        key: key.value || undefined,
        type: 1,
        sort: Number(sort.value || "1") as 1 | 2 | 3 | 4 | 5 | 6,
        tag_ids: tagId.value || undefined,
        page: nextPage,
        limit,
        page_mode: "has_more",
      });

      return {
        items: payload.list,
        hasMore: payload.pagination.has_more,
      };
    } catch (error) {
      requestError.value = error;
      console.error(`[search-articles] request failed: ${formatRequestError(error)}`);
      return {
        items: [],
        hasMore: false,
      };
    }
  },
});

const sortOptions = [
  { label: "综合相关度", value: "1" },
  { label: "最新发布", value: "2" },
  { label: "回复最多", value: "3" },
  { label: "点赞最多", value: "4" },
  { label: "收藏最多", value: "5" },
  { label: "阅读最多", value: "6" },
];

watch(
  page,
  async (nextPage, previousPage) => {
    if (nextPage === previousPage) {
      return;
    }

    try {
      await searchPager.goToPage(nextPage);
    } catch {
      // 错误状态已在 fetchPage 中收集，这里不重复抛出。
    }
  },
  { flush: "post" },
);

const articles = computed(() => searchPager.currentItems.value);
const pending = computed(() => searchPager.pending.value);
const cachedPageCount = computed(() => Object.keys(searchPager.pages.value).length);
const currentSearchPage = computed(() => searchPager.currentPage.value);

function handleReset() {
  key.value = "";
  sort.value = "1";
  tagId.value = "";
  page.value = 1;
  router.push({ path: "/search" });
}

function handleSearch() {
  page.value = 1;
  router.push({
    path: "/search",
    query: {
      ...(key.value ? { key: key.value } : {}),
      ...(sort.value && sort.value !== "1" ? { sort: sort.value } : {}),
      ...(tagId.value ? { tag_ids: tagId.value } : {}),
      ...(page.value > 1 ? { page: String(page.value) } : {}),
    },
  });
}

function buildQuery(targetPage = 1) {
  return {
    ...(key.value ? { key: key.value } : {}),
    ...(sort.value && sort.value !== "1" ? { sort: sort.value } : {}),
    ...(tagId.value ? { tag_ids: tagId.value } : {}),
    ...(targetPage > 1 ? { page: String(targetPage) } : {}),
  };
}

function handlePageChange(nextPage: number) {
  router.push({
    path: "/search",
    query: buildQuery(nextPage),
  });
}
</script>

<template>
  <div class="page-stack">
    <section class="filter-card">
      <div class="mb-5">
        <div class="eyebrow">Search</div>
        <h1 class="section-title mt-2">搜索文章</h1>
      </div>

      <div class="space-y-4">
        <NInput
          v-model:value="key"
          name="article-search"
          autocomplete="off"
          aria-label="搜索文章关键字"
          round
          clearable
          placeholder="输入关键字搜索文章标题、摘要或内容…"
          @keydown.enter.prevent="handleSearch"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex items-center">
            <select v-model="tagId" name="tag_ids" aria-label="标签筛选" class="h-12 w-full rounded-full border border-white/70 bg-white/78 px-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur">
              <option value="">全部标签</option>
              <option v-for="option in tagOptions || []" :key="option.value" :value="String(option.value)">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="flex items-center">
            <select v-model="sort" name="sort" aria-label="排序方式" class="h-12 w-full rounded-full border border-white/70 bg-white/78 px-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur">
              <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>

        <div class="flex items-center justify-end gap-3">
          <NButton quaternary @click="handleReset">重置</NButton>
          <NButton type="primary" @click="handleSearch">搜索</NButton>
        </div>
      </div>
    </section>

    <section class="surface-card p-5 md:p-6">
      <div class="mb-5 flex items-center justify-between">
        <div class="section-title">搜索结果</div>
        <div class="text-sm muted">每页 9 篇，当前第 {{ currentSearchPage }} 页，本次已缓存 {{ cachedPageCount }} 页。</div>
      </div>

      <div v-if="articles.length" class="space-y-4">
        <ArticleFeedItem
          v-for="article in articles"
          :key="article.id"
          :article="article"
          compact
        />
      </div>

      <div v-else class="surface-section flex min-h-[240px] items-center justify-center p-6 text-sm muted">
        {{
          pending
            ? "正在搜索中..."
            : requestError
              ? "文章加载失败，请检查前端 API 地址或测试环境状态。"
              : "没有匹配结果，换个关键词或筛选条件试试。"
        }}
      </div>

      <div
        v-if="articles.length"
        class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-5 text-sm muted"
      >
        <span>未刷新前，已访问页会直接复用缓存。</span>
        <div class="flex items-center gap-3">
          <NButton quaternary :disabled="!searchPager.hasPreviousPage" @click="handlePageChange(currentSearchPage - 1)">
            上一页
          </NButton>
          <NButton
            type="primary"
            ghost
            :disabled="!searchPager.hasNextPage"
            :loading="pending"
            @click="handlePageChange(currentSearchPage + 1)"
          >
            下一页
          </NButton>
        </div>
      </div>
    </section>
  </div>
</template>
