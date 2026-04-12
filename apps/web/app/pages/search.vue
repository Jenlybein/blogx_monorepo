<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { NButton, NInput } from "naive-ui";
import { getCategoryOptions, getTagOptions } from "~/services/search";

const route = useRoute();
const router = useRouter();

useSeoMeta({
  title: "搜索文章",
  description: "按关键词、分类、标签与排序方式搜索公开文章。",
});

const key = ref("");
const sort = ref("1");
const tagId = ref("");
const categoryId = ref("");
const page = ref(1);

watch(
  () => route.query,
  (query) => {
    key.value = typeof query.key === "string" ? query.key : "";
    sort.value = typeof query.sort === "string" ? query.sort : "1";
    tagId.value = typeof query.tag_ids === "string" ? query.tag_ids : "";
    categoryId.value = typeof query.category_id === "string" ? query.category_id : "";
    page.value = typeof query.page === "string" && query.page ? Number(query.page) : 1;
  },
  { immediate: true },
);

const { data: tagOptions } = await useAsyncData("search-tags", () => getTagOptions().catch(() => []));
const { data: categoryOptions } = await useAsyncData("search-categories", () => getCategoryOptions().catch(() => []));

const searchParams = computed(() => ({
  key: key.value || undefined,
  type: 1 as const,
  sort: Number(sort.value || "1") as 1 | 2 | 3 | 4 | 5 | 6,
  tag_ids: tagId.value || undefined,
  category_id: categoryId.value || undefined,
  page: page.value,
  limit: 12,
  page_mode: "count" as const,
}));

const { articles, pending, pagination, total } = await useArticleSearch(searchParams, {
  key: computed(() =>
      `search:${JSON.stringify({
        key: key.value,
        sort: sort.value,
        tag_ids: tagId.value,
        category_id: categoryId.value,
        page: page.value,
      })}`,
  ),
});

const sortOptions = [
  { label: "默认排序", value: "1" },
  { label: "最新发布", value: "2" },
  { label: "评论最多", value: "3" },
  { label: "点赞最多", value: "4" },
  { label: "收藏最多", value: "5" },
  { label: "阅读最多", value: "6" },
];

function handleReset() {
  key.value = "";
  sort.value = "1";
  tagId.value = "";
  categoryId.value = "";
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
      ...(categoryId.value ? { category_id: categoryId.value } : {}),
      ...(page.value > 1 ? { page: String(page.value) } : {}),
    },
  });
}

function handlePageChange(nextPage: number) {
  router.push({
    path: "/search",
    query: {
      ...(key.value ? { key: key.value } : {}),
      ...(sort.value && sort.value !== "1" ? { sort: sort.value } : {}),
      ...(tagId.value ? { tag_ids: tagId.value } : {}),
      ...(categoryId.value ? { category_id: categoryId.value } : {}),
      ...(nextPage > 1 ? { page: String(nextPage) } : {}),
    },
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

        <div class="grid gap-4 md:grid-cols-3">
          <label class="flex items-center">
            <select v-model="categoryId" name="category_id" aria-label="分类筛选" class="h-12 w-full rounded-full border border-white/70 bg-white/78 px-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur">
              <option value="">全部分类</option>
              <option v-for="option in categoryOptions || []" :key="option.value" :value="String(option.value)">
                {{ option.label }}
              </option>
            </select>
          </label>

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
        <div class="section-title">共 {{ total }} 条结果</div>
        <div class="text-sm muted">公开搜索场景默认按文章检索拉取结果</div>
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
        {{ pending ? "正在搜索中..." : "没有匹配结果，换个关键词或筛选条件试试。" }}
      </div>

      <div
        v-if="(pagination.total_pages || 0) > 1"
        class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-5 text-sm muted"
      >
        <span>第 {{ pagination.page }} / {{ pagination.total_pages }} 页</span>
        <div class="flex items-center gap-3">
          <NButton quaternary :disabled="pagination.page <= 1" @click="handlePageChange(pagination.page - 1)">
            上一页
          </NButton>
          <NButton
            type="primary"
            ghost
            :disabled="pagination.page >= (pagination.total_pages || 1)"
            @click="handlePageChange(pagination.page + 1)"
          >
            下一页
          </NButton>
        </div>
      </div>
    </section>
  </div>
</template>
