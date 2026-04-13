<script setup lang="ts">
import { NAvatar, NButton, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";
import type { SiteMessageItem } from "~/types/api";
import type { SiteMessageGroup } from "~/composables/useInboxCenter";
import { formatDateTimeLabel } from "~/utils/format";

defineProps<{
  categories: Array<{ key: SiteMessageGroup; label: string; hint: string; count: number }>;
  activeGroup: SiteMessageGroup;
  items: SiteMessageItem[];
  pending: boolean;
}>();

const emit = defineEmits<{
  "update:activeGroup": [value: SiteMessageGroup];
  markAllRead: [];
  remove: [id: string];
  clearGroup: [];
}>();

function typeLabel(type: number) {
  if (type === 1 || type === 2) return "评论";
  if (type >= 3 && type <= 8) return "互动";
  return "系统";
}
</script>

<template>
  <section class="surface-card studio-inbox-card">
    <div class="studio-inbox-grid">
      <aside class="studio-inbox-grid__aside">
        <button
          v-for="item in categories"
          :key="item.key"
          type="button"
          class="studio-filter-chip studio-filter-chip--stack"
          :class="{ 'is-active': activeGroup === item.key }"
          @click="emit('update:activeGroup', item.key)"
        >
          <span class="studio-filter-chip__main">
            <strong>{{ item.label }}</strong>
            <small>{{ item.hint }}</small>
          </span>
          <span class="studio-sidebar__badge">{{ item.count }}</span>
        </button>
      </aside>

      <div class="studio-inbox-grid__main">
        <div class="studio-toolbar">
          <div>
            <h2 class="section-title">站内消息</h2>
            <p class="muted">评论、点赞收藏和系统提醒都会聚合在这里。</p>
          </div>
          <NSpace>
            <NButton quaternary @click="emit('markAllRead')">全部已读</NButton>
            <NButton quaternary @click="emit('clearGroup')">清空当前分组</NButton>
          </NSpace>
        </div>

        <div v-if="items.length" class="space-y-3">
          <NList>
            <NListItem v-for="item in items" :key="item.id">
              <NThing :title="item.link_title || item.article_title" :description="item.content">
                <template #avatar>
                  <NAvatar round :src="item.action_user_avatar || undefined">
                    {{ (item.action_user_nickname || "系").slice(0, 1) }}
                  </NAvatar>
                </template>
                <template #header-extra>
                  <NSpace size="small">
                    <NTag size="small">{{ typeLabel(item.type) }}</NTag>
                    <NTag v-if="!item.is_read" size="small" type="warning">未读</NTag>
                  </NSpace>
                </template>
                <template #footer>
                  <div class="studio-list-meta">
                    <span>{{ formatDateTimeLabel(item.created_at) }}</span>
                    <NuxtLink v-if="item.link_herf" :to="item.link_herf" class="glass-badge">查看原文</NuxtLink>
                  </div>
                </template>
              </NThing>
              <template #suffix>
                <NButton quaternary size="small" @click="emit('remove', item.id)">删除</NButton>
              </template>
            </NListItem>
          </NList>
        </div>

        <StudioEmptyState
          v-else
          title="当前分组还没有消息"
          :description="pending ? '正在同步消息数据…' : '你的消息收件箱很安静，等互动出现后这里会自动聚合。'"
        />
      </div>
    </div>
  </section>
</template>
