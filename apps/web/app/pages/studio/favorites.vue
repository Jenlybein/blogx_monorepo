<script setup lang="ts">
import { watch } from "vue";
import { NButton, NInput, useMessage } from "naive-ui";
import {
  createFavoriteFolder,
  deleteFavoriteFolders,
  getFavoriteFolderArticles,
  getOwnFavoriteFolders,
  removeFavoriteFolderArticles,
  updateFavoriteFolder,
} from "~/services/favorite";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const activeFolderId = shallowRef<string>("");
const folderForm = reactive({
  title: "",
  abstract: "",
});

const { data: folders, refresh: refreshFolders } = await useAsyncData("studio-favorite-folders", () => getOwnFavoriteFolders());
const { data: contents, pending: contentsPending, refresh: refreshContents } = await useAsyncData(
  () => `studio-favorite-contents:${activeFolderId.value}`,
  () =>
    activeFolderId.value
      ? getFavoriteFolderArticles({ favoriteId: activeFolderId.value, page: 1, limit: 30 })
      : Promise.resolve({ list: [], count: 0 }),
  {
    watch: [activeFolderId],
  },
);

watch(
  () => folders.value?.list,
  (list) => {
    if (!list?.length) {
      activeFolderId.value = "";
      folderForm.title = "";
      folderForm.abstract = "";
      return;
    }

    if (!activeFolderId.value || !list.some((item) => item.id === activeFolderId.value)) {
      activeFolderId.value = list[0]?.id ?? "";
    }
  },
  { immediate: true },
);

watch(
  () => [activeFolderId.value, folders.value?.list] as const,
  () => {
    const current = folders.value?.list.find((item) => item.id === activeFolderId.value);
    folderForm.title = current?.title ?? "";
    folderForm.abstract = current?.abstract ?? "";
  },
  { immediate: true },
);

async function handleCreateFolder() {
  try {
    await createFavoriteFolder({
      title: folderForm.title.trim() || "新的收藏夹",
      abstract: folderForm.abstract.trim() || "为稍后阅读保留一组主题内容。",
    });
    message.success("收藏夹已创建");
    await refreshFolders();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "创建收藏夹失败");
  }
}

async function handleUpdateFolder() {
  if (!activeFolderId.value) return;
  try {
    await updateFavoriteFolder({
      id: activeFolderId.value,
      title: folderForm.title.trim(),
      abstract: folderForm.abstract.trim(),
    });
    message.success("收藏夹已更新");
    await refreshFolders();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "更新收藏夹失败");
  }
}

async function handleDeleteFolder() {
  if (!activeFolderId.value) return;
  try {
    await deleteFavoriteFolders([activeFolderId.value]);
    message.success("收藏夹已删除");
    await refreshFolders();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "删除收藏夹失败");
  }
}

async function removeArticle(articleId: string) {
  if (!activeFolderId.value) return;
  try {
    await removeFavoriteFolderArticles({
      favoriteId: activeFolderId.value,
      articleIds: [articleId],
    });
    message.success("文章已移出收藏夹");
    await refreshContents();
    await refreshFolders();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "移除收藏内容失败");
  }
}

useSeoMeta({
  title: "个人中心 - 收藏夹",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="收藏夹"
      description="正式版不再只停留在“有个收藏按钮”，而是把收藏夹分组、分组资料和组内内容都落成可管理页面。"
      eyebrow="Favorites"
    />

    <section class="surface-card studio-inbox-card">
      <div class="studio-inbox-grid">
        <aside class="studio-inbox-grid__aside">
          <div class="studio-toolbar studio-toolbar--stack">
            <div>
              <h2 class="section-title">我的分组</h2>
              <p class="muted">点击左侧分组，右侧会切换内容与分组资料。</p>
            </div>
            <NButton type="primary" @click="handleCreateFolder()">新建收藏夹</NButton>
          </div>

          <div class="mt-4 space-y-2">
            <button
              v-for="folder in folders?.list || []"
              :key="folder.id"
              type="button"
              class="studio-filter-chip studio-filter-chip--stack"
              :class="{ 'is-active': activeFolderId === folder.id }"
              @click="activeFolderId = folder.id"
            >
              <span class="studio-filter-chip__main">
                <strong>{{ folder.title }}</strong>
                <small>{{ folder.abstract || "暂未填写简介" }}</small>
              </span>
              <span class="studio-sidebar__badge">{{ folder.article_count }}</span>
            </button>
          </div>
        </aside>

        <div class="studio-inbox-grid__main space-y-5">
          <section class="surface-section p-4 md:p-5">
            <div class="studio-toolbar">
              <div>
                <h2 class="section-title">分组资料</h2>
                <p class="muted">这里直接对应 `/api/articles/favorite` 的增改删能力。</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <NButton quaternary @click="handleUpdateFolder()" :disabled="!activeFolderId">保存修改</NButton>
                <NButton quaternary type="error" @click="handleDeleteFolder()" :disabled="!activeFolderId">删除分组</NButton>
              </div>
            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <label class="space-y-2">
                <span class="text-sm font-medium">分组名称</span>
                <NInput v-model:value="folderForm.title" maxlength="40" placeholder="例如：前端架构参考…" />
              </label>
              <label class="space-y-2 md:col-span-2">
                <span class="text-sm font-medium">分组简介</span>
                <NInput
                  v-model:value="folderForm.abstract"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  maxlength="120"
                  placeholder="描述这个收藏夹主要收什么内容…"
                />
              </label>
            </div>
          </section>

          <section class="studio-list-card !p-0">
            <div class="studio-toolbar border-b border-slate-200/70 px-5 py-4 dark:border-slate-700/70">
              <div>
                <h2 class="section-title">分组内容</h2>
                <p class="muted">当前共 {{ contents?.count ?? 0 }} 篇内容。</p>
              </div>
            </div>

            <div v-if="contents?.list.length" class="favorite-content-list">
              <article v-for="item in contents?.list" :key="item.article_id" class="favorite-content-card">
                <NuxtLink :to="`/article/${item.article_id}`" class="favorite-content-card__cover-wrap" aria-label="查看文章详情">
                  <div
                    v-if="item.cover"
                    class="favorite-content-card__cover"
                    :style="{ backgroundImage: `url(${item.cover})` }" />
                  <div v-else class="favorite-content-card__cover-empty">NO COVER</div>
                </NuxtLink>

                <div class="favorite-content-card__main">
                  <NuxtLink :to="`/article/${item.article_id}`" class="favorite-content-card__title">
                    {{ item.title }}
                  </NuxtLink>
                  <p class="favorite-content-card__abstract">
                    {{ item.abstract || "这篇文章暂无摘要，点击查看原文获取完整内容。" }}
                  </p>
                  <div class="favorite-content-card__meta">
                    <span>{{ item.user_nickname }}</span>
                    <span>{{ item.view_count }} 阅读</span>
                    <span>收藏于 {{ formatDateTimeLabel(item.favorited_at) }}</span>
                  </div>
                </div>

                <div class="favorite-content-card__actions">
                  <NuxtLink :to="`/article/${item.article_id}`" class="glass-badge">查看原文</NuxtLink>
                  <NButton quaternary size="small" @click="removeArticle(item.article_id)">移出</NButton>
                </div>
              </article>
            </div>
            <StudioEmptyState
              v-else
              title="这个收藏夹还是空的"
              :description="contentsPending ? '正在拉取收藏内容…' : '先去文章详情页收藏内容，或者切换到另一个分组继续整理。'"
              class="m-5"
            />
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.favorite-content-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}

.favorite-content-card {
  display: grid;
  grid-template-columns: 176px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: stretch;
  border: 1px solid rgba(217, 226, 236, 0.8);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.84);
  padding: 10px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.favorite-content-card:hover {
  border-color: rgba(15, 118, 110, 0.24);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.favorite-content-card__cover-wrap {
  border-radius: 14px;
  overflow: hidden;
  display: block;
  height: 100%;
  min-height: 112px;
}

.favorite-content-card__cover {
  width: 100%;
  height: 100%;
  min-height: 112px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.favorite-content-card__cover-empty {
  width: 100%;
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(148, 163, 184, 0.65);
  border-radius: 14px;
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 0.14em;
}

.favorite-content-card__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.favorite-content-card__title {
  color: #1e293b;
  font-size: 18px;
  line-height: 1.35;
  font-weight: 700;
  text-decoration: none;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-content-card__title:hover {
  color: #0f766e;
}

.favorite-content-card__abstract {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-content-card__meta {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
}

.favorite-content-card__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  min-width: 88px;
}

@media (max-width: 980px) {
  .favorite-content-card {
    grid-template-columns: 144px minmax(0, 1fr);
    gap: 12px;
  }

  .favorite-content-card__actions {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-end;
    padding-top: 4px;
  }

  .favorite-content-card__cover,
  .favorite-content-card__cover-empty {
    min-height: 98px;
  }
}

@media (max-width: 640px) {
  .favorite-content-list {
    padding: 10px;
    gap: 10px;
  }

  .favorite-content-card {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  .favorite-content-card__cover,
  .favorite-content-card__cover-empty {
    min-height: 154px;
  }

  .favorite-content-card__actions {
    justify-content: flex-start;
  }
}
</style>
