<script setup lang="ts">
import { computed, h } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  NAvatar,
  NButton,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NSpace,
} from "naive-ui";
import type { MenuOption } from "naive-ui";
import { adminNav, studioNav } from "@/data/mock";

const props = defineProps<{
  kind: "studio" | "admin";
  title: string;
  subtitle: string;
  breadcrumb: string;
  themeLabel: string;
}>();

const emit = defineEmits<{
  toggleTheme: [];
}>();

const route = useRoute();

const groups = computed(() => (props.kind === "admin" ? adminNav : studioNav));

const menuOptions = computed<MenuOption[]>(() =>
  groups.value.flatMap((group) => [
    {
      key: `${group.title}-group`,
      type: "group",
      label: group.title,
      children: group.items.map((item) => ({
        key: item.to,
        label: () =>
          h(
            RouterLink,
            {
              to: item.to,
              class: "menu-link",
            },
            { default: () => item.label },
          ),
      })),
    },
  ]),
);

const currentUserLabel = computed(() => (props.kind === "admin" ? "管理员 · Louis" : "作者 · Aster"));
</script>

<template>
  <NLayout has-sider class="workspace-shell">
    <NLayoutSider :width="272" bordered collapse-mode="width" :native-scrollbar="false" class="workspace-sider">
      <div class="workspace-brand">
        <div class="brand-badge">BX</div>
        <div>
          <strong>{{ props.kind === "admin" ? "运营后台" : "创作工作台" }}</strong>
          <p class="muted">prototype shell</p>
        </div>
      </div>
      <NMenu :value="route.path" :options="menuOptions" />
      <div v-if="props.kind === 'studio'" class="workspace-shortcuts">
        <RouterLink to="/">查看门户</RouterLink>
      </div>
    </NLayoutSider>

    <NLayout>
      <NLayoutHeader class="topbar-card workspace-header">
        <div>
          <p class="eyebrow">{{ breadcrumb }}</p>
          <h1 class="workspace-title">{{ title }}</h1>
          <p class="muted page-subtitle">{{ subtitle }}</p>
        </div>
        <NSpace align="center">
          <NButton quaternary @click="emit('toggleTheme')">{{ themeLabel }}</NButton>
          <NButton quaternary>刷新</NButton>
          <NButton quaternary>命令面板</NButton>
          <div class="user-pill">
            <NAvatar round size="small">{{ props.kind === "admin" ? "LO" : "AS" }}</NAvatar>
            <span>{{ currentUserLabel }}</span>
          </div>
        </NSpace>
      </NLayoutHeader>
      <NLayoutContent class="shell-main workspace-main">
        <slot />
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>
