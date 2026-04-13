<script setup lang="ts">
import { NButton, NList, NListItem, NThing, NTag, useMessage } from "naive-ui";
import { deleteCommentById, getManageComments } from "~/services/studio";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const typeFilter = shallowRef<1 | 2>(1);

const { data, pending, refresh } = await useAsyncData(
  () => `studio-comments:${typeFilter.value}`,
  () => getManageComments({ type: typeFilter.value, page: 1, limit: 20 }),
  { watch: [typeFilter] },
);

async function removeComment(id: string) {
  try {
    await deleteCommentById(id);
    message.success("评论已删除");
    await refresh();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "删除评论失败");
  }
}

useSeoMeta({
  title: "个人中心 - 评论管理",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="评论管理"
      description="这里承接用户侧评论管理链路。由于后端接口的 type 语义没有在 OpenAPI 里完全解释，前端先保留两类视图切换并按真实返回结果展示。"
      eyebrow="Comments"
    />

    <section class="studio-list-card">
      <div class="studio-toolbar">
        <div class="studio-filter-row">
          <button type="button" class="studio-filter-chip" :class="{ 'is-active': typeFilter === 1 }" @click="typeFilter = 1">
            视图 1
          </button>
          <button type="button" class="studio-filter-chip" :class="{ 'is-active': typeFilter === 2 }" @click="typeFilter = 2">
            视图 2
          </button>
        </div>
        <NButton quaternary @click="refresh()">刷新评论</NButton>
      </div>

      <NList v-if="data?.list.length" class="mt-4">
        <NListItem v-for="item in data?.list" :key="item.id">
          <NThing :title="item.article_title" :description="item.content">
            <template #header-extra>
              <NTag size="small">{{ item.reply_count }} 回复</NTag>
            </template>
            <template #footer>
              <div class="studio-list-meta">
                <span>{{ item.user_nickname }}</span>
                <span>{{ item.digg_count }} 点赞</span>
                <span>{{ formatDateTimeLabel(item.created_at) }}</span>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <div class="flex flex-wrap gap-2">
              <NuxtLink :to="`/article/${item.article_id}`" class="glass-badge">查看文章</NuxtLink>
              <NButton quaternary size="small" @click="removeComment(item.id)">删除</NButton>
            </div>
          </template>
        </NListItem>
      </NList>
      <StudioEmptyState
        v-else
        title="当前视图没有评论数据"
        :description="pending ? '正在同步评论记录…' : '等评论或回复发生后，这里会展示对应内容。'"
        class="mt-5"
      />
    </section>
  </div>
</template>
