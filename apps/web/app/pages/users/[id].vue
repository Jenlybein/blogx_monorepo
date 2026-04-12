<script setup lang="ts">
import { computed } from "vue";
import { NButton, NTag, useMessage } from "naive-ui";
import { followUser, unfollowUser } from "~/services/follow";
import { getUserBaseInfo } from "~/services/user";
import { formatCount } from "~/utils/format";

const route = useRoute();
const router = useRouter();
const userId = computed(() => route.params.id as string);
const authStore = useAuthStore();
const message = useMessage();

const tab = computed({
  get: () => (typeof route.query.tab === "string" ? route.query.tab : "articles"),
  set: (value: string) => {
    router.replace({
      query: {
        ...route.query,
        ...(value !== "articles" ? { tab: value } : {}),
      },
    });
  },
});

const { data: profile, refresh: refreshProfile } = await useAsyncData(
  () => `user-base-${userId.value}`,
  () =>
    getUserBaseInfo(userId.value).catch(() => ({
      id: userId.value,
      code_age: 0,
      avatar: "",
      nickname: "未知作者",
      abstract: "",
      view_count: 0,
      fans_count: 0,
      follow_count: 0,
      favorites_visibility: true,
      followers_visibility: true,
      fans_visibility: true,
      home_style_id: null,
      relation: 0,
      place: "",
    })),
);

const { articles, pending: articlePending } = await useArticleSearch(
  computed(() => ({
    type: 3 as const,
    author_id: userId.value,
    page: 1,
    limit: 12,
    page_mode: "count" as const,
    sort: 2 as const,
  })),
  {
    key: computed(() => `user-articles:${userId.value}`),
  },
);

const isSelf = computed(() => authStore.profileId != null && String(authStore.profileId) === profile.value?.id);
const relationText = computed(() => {
  switch (profile.value?.relation) {
    case 1:
      return "已关注";
    case 2:
      return "对方关注了你";
    case 3:
      return "互相关注";
    default:
      return "关注作者";
  }
});

async function handleFollow() {
  if (!profile.value) return;
  if (!authStore.isLoggedIn) {
    useUiStore().openAuthModal();
    return;
  }

  try {
    if (profile.value.relation === 1 || profile.value.relation === 3) {
      await unfollowUser(profile.value.id);
      message.success("已取消关注");
    } else {
      await followUser(profile.value.id);
      message.success("已关注作者");
    }
    await refreshProfile();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "操作失败");
  }
}

useSeoMeta({
  title: computed(() => `${profile.value?.nickname || "作者"} - 个人主页`),
  description: computed(() => profile.value?.abstract || "开发者个人主页"),
});
</script>

<template>
  <div class="page-stack">
    <div class="content-grid">
      <div class="page-stack">
        <ProfileHeroCard
          v-if="profile"
          :profile="profile"
          :is-self="isSelf"
          :relation-text="relationText"
          @follow="handleFollow"
        />

        <section class="surface-card p-5 md:p-6">
          <div class="mb-5 flex items-center justify-between">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in [
                  { label: '文章', value: 'articles' },
                  { label: '收藏', value: 'favorites' },
                  { label: '关注', value: 'follow' },
                  { label: '粉丝', value: 'fans' },
                ]"
                :key="item.value"
                type="button"
                class="soft-tab"
                :class="{ 'is-active': tab === item.value }"
                @click="tab = item.value"
              >
                {{ item.label }}
              </button>
            </div>
            <NButton quaternary @click="tab = 'articles'">回到文章流</NButton>
          </div>

          <template v-if="tab === 'articles'">
            <div v-if="articles.length" class="space-y-4">
              <ArticleFeedItem
                v-for="article in articles"
                :key="article.id"
                :article="article"
                compact
                :show-author="false"
              />
            </div>
            <div v-else class="surface-section flex min-h-[220px] items-center justify-center p-6 text-sm muted">
              {{ articlePending ? "正在加载作者文章..." : "这位作者还没有公开文章。" }}
            </div>
          </template>

          <div v-else class="surface-section flex min-h-[220px] items-center justify-center p-6 text-sm muted">
            Phase 2 先把作者公开主页和作品流打通，其余公开分栏在后续阶段继续补齐。
          </div>
        </section>
      </div>

      <aside class="profile-sidebar">
        <section class="surface-card p-5 md:p-6">
          <div class="section-title">个人成就</div>
          <div class="mt-4 line-divider">
            <div class="sidebar-list-row">
              <span class="muted">关注了</span>
              <strong>{{ profile?.follow_count || 0 }}</strong>
            </div>
            <div class="sidebar-list-row">
              <span class="muted">关注者</span>
              <strong>{{ profile?.fans_count || 0 }}</strong>
            </div>
            <div class="sidebar-list-row">
              <span class="muted">累计阅读</span>
              <strong>{{ formatCount(profile?.view_count || 0) }}</strong>
            </div>
          </div>
        </section>

        <section class="surface-card p-5 md:p-6">
          <div class="sidebar-list-row">
            <span class="muted">加入信息</span>
            <strong>{{ profile?.place || "未填写地区" }}</strong>
          </div>
          <div class="sidebar-list-row line-divider">
            <span class="muted">代码年龄</span>
            <strong>{{ profile?.code_age || 0 }} 年</strong>
          </div>
          <div class="sidebar-list-row line-divider">
            <span class="muted">关系状态</span>
            <NTag size="small" round :bordered="false">{{ relationText }}</NTag>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>
