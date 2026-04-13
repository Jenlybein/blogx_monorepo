<script setup lang="ts">
import { computed } from "vue";
import { NAvatar, NTag } from "naive-ui";
import type { SearchArticleItem, SiteAiInfo, SiteRuntimeConfig } from "~/types/api";

const props = defineProps<{
  runtimeConfig: SiteRuntimeConfig | null;
  aiInfo: SiteAiInfo | null;
  articles: SearchArticleItem[];
}>();

const enabledModules = computed(() => {
  const source = props.runtimeConfig?.index_right?.list || [];
  return new Set(
    source
      .map((item) => String(item.title || "").trim())
      .filter(Boolean),
  );
});

const loginModes = computed(() => {
  const login = props.runtimeConfig?.login;
  const result: string[] = [];

  if (login?.pwd) result.push("密码登录");
  if (login?.email) result.push("邮箱登录");
  if (login?.qq) result.push("QQ 登录");

  return result;
});

const hotTags = computed(() => {
  const tagMap = new Map<string, { id: string; title: string; count: number }>();

  for (const article of props.articles) {
    for (const tag of article.tags || []) {
      const current = tagMap.get(tag.id);
      if (current) {
        current.count += 1;
      } else {
        tagMap.set(tag.id, {
          id: tag.id,
          title: tag.title,
          count: 1,
        });
      }
    }
  }

  return [...tagMap.values()]
    .sort((left, right) => right.count - left.count || left.id.localeCompare(right.id))
    .slice(0, 8);
});

const recommendedAuthors = computed(() => {
  const authorMap = new Map<
    string,
    {
      id: string;
      nickname: string;
      avatar: string;
      articleCount: number;
      totalViews: number;
    }
  >();

  for (const article of props.articles) {
    const current = authorMap.get(article.author.id);
    if (current) {
      current.articleCount += 1;
      current.totalViews += article.view_count;
      continue;
    }

    authorMap.set(article.author.id, {
      id: article.author.id,
      nickname: article.author.nickname,
      avatar: article.author.avatar,
      articleCount: 1,
      totalViews: article.view_count,
    });
  }

  return [...authorMap.values()]
    .sort((left, right) => right.articleCount - left.articleCount || right.totalViews - left.totalViews)
    .slice(0, 4);
});

const showNotice = computed(() => enabledModules.value.size === 0 || enabledModules.value.has("site_notice"));
const showTags = computed(() => enabledModules.value.size === 0 || enabledModules.value.has("hot_tags"));
const showAuthors = computed(() => enabledModules.value.size === 0 || enabledModules.value.has("recommended_authors"));

const projectTitle = computed(() => props.runtimeConfig?.project?.title || props.runtimeConfig?.site_info?.title || "BlogX");
const projectAbstract = computed(
  () => props.runtimeConfig?.project?.abstract || props.runtimeConfig?.site_info?.subtitle || "为开发者写作、搜索与知识整理提供稳定的内容入口。",
);
</script>

<template>
  <aside class="profile-sidebar home-sidebar">
    <section v-if="showNotice" class="surface-card p-5 md:p-6">
      <div class="text-base font-semibold">站点公告</div>
      <p class="mt-2 text-sm leading-7 muted">
        {{ projectAbstract }}
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <NTag size="small" round :bordered="false">
          {{ projectTitle }}
        </NTag>
        <NTag
          v-for="mode in loginModes"
          :key="mode"
          size="small"
          round
          :bordered="false"
          type="success"
        >
          {{ mode }}
        </NTag>
      </div>
    </section>

    <section v-if="showTags && hotTags.length" class="surface-card p-5 md:p-6">
      <div class="text-base font-semibold">热门标签</div>
      <div class="mt-3 flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in hotTags"
          :key="tag.id"
          :to="{ path: '/search', query: { tag_ids: tag.id } }"
          class="inline-flex"
        >
          <NTag
            size="small"
            round
            :bordered="false"
          >
            {{ tag.title }}
          </NTag>
        </NuxtLink>
      </div>
    </section>

    <section v-if="showAuthors && recommendedAuthors.length" class="surface-card p-5 md:p-6">
      <div class="text-base font-semibold">推荐作者</div>
      <div class="mt-3 space-y-3">
        <NuxtLink
          v-for="author in recommendedAuthors"
          :key="author.id"
          :to="`/users/${author.id}`"
          class="flex items-center justify-between gap-3 rounded-2xl px-1 py-1 transition hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
        >
          <div class="flex items-center gap-3">
            <NAvatar round :size="38" :src="author.avatar || undefined">
              {{ author.nickname.slice(0, 1).toUpperCase() }}
            </NAvatar>
            <div>
              <div class="text-sm font-semibold">{{ author.nickname }}</div>
              <div class="text-xs muted">{{ author.articleCount }} 篇文章</div>
            </div>
          </div>
          <span class="text-xs muted">{{ author.totalViews }} 阅读</span>
        </NuxtLink>
      </div>
    </section>

    <section class="surface-card p-5 md:p-6">
      <div class="section-title">AI 助手</div>
      <div class="mt-4 flex items-center gap-3">
        <img
          v-if="aiInfo?.avatar"
          :src="aiInfo.avatar"
          alt="AI 助手"
          class="h-14 w-14 rounded-2xl object-cover"
        />
        <div>
          <div class="text-base font-semibold">{{ aiInfo?.nickname || "AI 助手" }}</div>
          <p class="mt-1 text-sm leading-6 muted">
            {{ aiInfo?.abstract || "在搜索、写作和诊断场景里协助作者提高产出效率。" }}
          </p>
        </div>
      </div>
      <NuxtLink to="/search" class="mt-4 inline-flex text-sm font-medium text-teal-700 dark:text-teal-300">
        去搜索页体验 AI 搜索
      </NuxtLink>
    </section>
  </aside>
</template>
