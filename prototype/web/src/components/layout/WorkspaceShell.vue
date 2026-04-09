<script setup lang="ts">
import { computed, h, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import {
  NAvatar,
  NButton,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  useMessage,
} from "naive-ui";
import type { MenuOption } from "naive-ui";
import { adminNav, publicNav, studioNav, type PublicUser } from "@/data/mock";

const props = defineProps<{
  kind: "studio" | "admin";
  currentUser: PublicUser | null;
  title: string;
  subtitle: string;
  breadcrumb: string;
  themeLabel: string;
}>();

const emit = defineEmits<{
  toggleTheme: [];
  openAuth: [];
}>();

const route = useRoute();
const router = useRouter();
const message = useMessage();
const searchActive = ref(false);
const searchKeyword = ref("");

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

function handleNavClick(item: { label: string; to: string }, event: MouseEvent) {
  if (item.to !== "/courses") {
    return;
  }

  event.preventDefault();
  message.info("该模块暂未开放");
}

function activateSearch() {
  searchActive.value = true;
}

function deactivateSearch(event: FocusEvent) {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && event.currentTarget instanceof HTMLElement) {
    if (event.currentTarget.contains(nextTarget)) {
      return;
    }
  }

  searchActive.value = false;
}

function goSearch() {
  void router.push({
    path: "/search",
    query: searchKeyword.value.trim() ? { keyword: searchKeyword.value.trim() } : undefined,
  });
  searchActive.value = false;
}
</script>

<template>
  <NLayout class="workspace-shell">
    <NLayoutHeader class="topbar-card workspace-header">
      <div class="public-shell__leading">
        <RouterLink to="/" class="brand-block brand-block--link">
          <div class="brand-badge">BX</div>
          <div class="brand-copy">
            <strong>BlogX</strong>
            <p class="muted">为开发者写作而生的内容平台</p>
          </div>
        </RouterLink>
        <nav class="public-shell__nav">
          <RouterLink
            v-for="item in publicNav"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link--active': route.path === item.to }"
            @click="handleNavClick(item, $event)"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </div>
      <div class="public-shell__actions">
        <div class="header-search" @focusin="activateSearch" @focusout="deactivateSearch">
          <NInput v-model:value="searchKeyword" placeholder="搜索文章、课程、标签或作者" clearable @keyup.enter="goSearch" />
          <Transition name="search-button-fade">
            <NButton v-if="searchActive" size="small" type="primary" class="header-search__button" @click="goSearch">
              搜索
            </NButton>
          </Transition>
        </div>
        <RouterLink v-if="props.currentUser" to="/studio/profile" class="user-pill user-pill--link">
          <NAvatar round size="small">{{ props.currentUser.avatarText }}</NAvatar>
          <span>{{ props.currentUser.nickname }}</span>
        </RouterLink>
        <NButton v-else-if="props.kind === 'studio'" quaternary @click="emit('openAuth')">登录 / 注册</NButton>
        <div v-else class="user-pill">
          <NAvatar round size="small">{{ props.kind === "admin" ? "LO" : "AS" }}</NAvatar>
          <span>{{ currentUserLabel }}</span>
        </div>
        <RouterLink :to="props.kind === 'admin' ? '/' : '/studio/write'">
          <NButton type="primary">{{ props.kind === "admin" ? "返回首页" : "创作文章" }}</NButton>
        </RouterLink>
        <NButton quaternary @click="emit('toggleTheme')">{{ themeLabel }}</NButton>
      </div>
    </NLayoutHeader>

    <NLayout has-sider class="workspace-body">
      <NLayoutSider :width="272" bordered collapse-mode="width" :native-scrollbar="false" class="workspace-sider">
        <div class="workspace-brand">
          <div class="brand-badge">BX</div>
          <div>
            <strong>{{ props.kind === "admin" ? "运营后台" : "个人中心" }}</strong>
            <p class="muted">prototype shell</p>
          </div>
        </div>
        <NMenu :value="route.path" :options="menuOptions" />
      </NLayoutSider>

      <NLayout class="workspace-content">
        <NLayoutContent class="shell-main workspace-main">
          <slot />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </NLayout>
</template>
