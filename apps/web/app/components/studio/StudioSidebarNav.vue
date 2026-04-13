<script setup lang="ts">
import { computed } from "vue";
import {
  IconBellRinging,
  IconBookmarks,
  IconClockHour4,
  IconDashboard,
  IconFileText,
  IconHeartHandshake,
  IconLogin2,
  IconMessageCircle,
  IconSettings,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-vue";

const route = useRoute();
const authStore = useAuthStore();
const messageStore = useMessageStore();

const items = computed(() => [
  { label: "数据概览", to: "/studio/dashboard", icon: IconDashboard },
  { label: "我的文章", to: "/studio/profile", icon: IconFileText },
  { label: "浏览历史", to: "/studio/history", icon: IconClockHour4 },
  { label: "收藏夹", to: "/studio/favorites", icon: IconBookmarks },
  { label: "评论管理", to: "/studio/comments", icon: IconMessageCircle },
  { label: "关注", to: "/studio/follows", icon: IconHeartHandshake },
  { label: "粉丝", to: "/studio/fans", icon: IconUsers },
  { label: "最近登录", to: "/studio/recent-logins", icon: IconLogin2 },
  { label: "账号设置", to: "/studio/settings", icon: IconSettings },
  { label: "消息中心", to: "/studio/inbox", icon: IconBellRinging, badge: messageStore.totalUnread },
]);
</script>

<template>
  <aside class="surface-card studio-sidebar">
    <div class="studio-sidebar__profile">
      <div class="studio-sidebar__avatar">
        <img
          v-if="authStore.currentUser?.avatar"
          :src="authStore.currentUser.avatar"
          :alt="authStore.profileName"
          width="72"
          height="72"
          loading="lazy"
        />
        <span v-else>{{ authStore.profileName.slice(0, 1).toUpperCase() }}</span>
      </div>
      <div class="min-w-0">
        <div class="eyebrow">Studio</div>
        <div class="studio-sidebar__name">{{ authStore.profileName }}</div>
        <div class="muted truncate">
          {{ authStore.currentUser?.abstract || "围绕创作、社交、消息与账号资料管理你的空间。" }}
        </div>
      </div>
    </div>

    <nav class="studio-sidebar__nav" aria-label="个人中心导航">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="studio-sidebar__link"
        :class="{ 'is-active': route.path === item.to }"
      >
        <span class="studio-sidebar__link-main">
          <component :is="item.icon" :size="18" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </span>
        <span v-if="item.badge" class="studio-sidebar__badge">{{ item.badge }}</span>
      </NuxtLink>
    </nav>

    <NuxtLink
      v-if="authStore.profileId"
      :to="`/users/${authStore.profileId}`"
      class="studio-sidebar__profile-link"
    >
      <IconUserSquareRounded :size="16" aria-hidden="true" />
      <span>查看公开主页</span>
    </NuxtLink>
  </aside>
</template>
