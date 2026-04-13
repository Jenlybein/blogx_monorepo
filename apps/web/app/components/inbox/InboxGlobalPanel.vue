<script setup lang="ts">
import { NButton, NSpace, NTag } from "naive-ui";
import type { GlobalNoticeItem } from "~/types/api";
import { formatDateTimeLabel } from "~/utils/format";

defineProps<{
  items: GlobalNoticeItem[];
  pending: boolean;
}>();

const emit = defineEmits<{
  markAllRead: [];
  remove: [id: string];
}>();
</script>

<template>
  <section class="surface-card studio-inbox-card p-5 md:p-6">
    <div class="studio-toolbar">
      <div>
        <div class="eyebrow">Broadcast</div>
        <h2 class="section-title mt-2">全局通知</h2>
      </div>
      <NButton quaternary @click="emit('markAllRead')">全部已读</NButton>
    </div>

    <div v-if="items.length" class="mt-5 space-y-3">
      <article v-for="item in items" :key="item.id" class="studio-notice-card">
        <div class="studio-notice-card__head">
          <div class="flex items-center gap-2">
            <strong>{{ item.title }}</strong>
            <NTag v-if="!item.is_read" size="small" type="warning">未读</NTag>
          </div>
          <span class="muted text-sm">{{ formatDateTimeLabel(item.create_at) }}</span>
        </div>
        <p class="muted mt-3 leading-7">{{ item.content }}</p>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <NuxtLink v-if="item.herf" :to="item.herf" class="glass-badge">查看详情</NuxtLink>
          <NSpace class="ml-auto">
            <NButton quaternary size="small" @click="emit('remove', item.id)">删除</NButton>
          </NSpace>
        </div>
      </article>
    </div>

    <StudioEmptyState
      v-else
      title="还没有全局通知"
      :description="pending ? '正在拉取最新通知…' : '系统公告、活动与运营提醒会在这里统一展示。'"
      class="mt-5"
    />
  </section>
</template>
