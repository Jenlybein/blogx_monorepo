<script setup lang="ts">
import { NButton, NList, NListItem, NThing, useMessage } from "naive-ui";
import { deleteHistoryArticles, getHistoryArticles } from "~/services/studio";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();

const { data, pending, refresh } = await useAsyncData("studio-history", () => getHistoryArticles({ type: 1 }));

async function removeOne(id: string) {
  try {
    await deleteHistoryArticles([id]);
    message.success("已移出浏览历史");
    await refresh();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "删除历史失败");
  }
}

useSeoMeta({
  title: "个人中心 - 浏览历史",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="浏览历史"
      description="集中查看最近读过的文章、回访时间和入口痕迹，方便继续阅读或快速清理自己的阅读面板。"
      eyebrow="History"
    >
      <NButton quaternary @click="refresh()">刷新记录</NButton>
    </StudioPageHeader>

    <section class="studio-list-card">
      <NList v-if="data?.list.length">
        <NListItem v-for="item in data?.list" :key="`${item.article_id}-${item.updated_at}`">
          <NThing :title="item.title" :description="`作者：${item.nickname}`">
            <template #footer>
              <div class="studio-list-meta">
                <span>{{ formatDateTimeLabel(item.updated_at) }}</span>
                <NuxtLink :to="`/article/${item.article_id}`" class="glass-badge">继续阅读</NuxtLink>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <NButton quaternary size="small" @click="removeOne(item.article_id)">移出历史</NButton>
          </template>
        </NListItem>
      </NList>
      <StudioEmptyState
        v-else
        title="还没有浏览历史"
        :description="pending ? '正在读取历史记录…' : '先去首页或搜索页看看文章，访问记录会自动出现在这里。'"
      />
    </section>
  </div>
</template>
