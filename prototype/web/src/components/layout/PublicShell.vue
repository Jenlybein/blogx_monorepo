<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import {
  NAvatar,
  NButton,
  NCard,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  useMessage,
} from "naive-ui";
import { publicNav, type PublicUser } from "@/data/mock";

defineProps<{
  currentUser: PublicUser | null;
  title: string;
  subtitle: string;
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
  <NLayout class="public-shell">
    <NLayoutHeader class="topbar-card public-shell__header">
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
        <RouterLink v-if="currentUser" to="/studio/profile" class="user-pill user-pill--link">
          <NAvatar round size="small">{{ currentUser.avatarText }}</NAvatar>
          <span>{{ currentUser.nickname }}</span>
        </RouterLink>
        <NButton v-else quaternary @click="emit('openAuth')">登录 / 注册</NButton>
        <RouterLink to="/studio/write">
          <NButton type="primary">创作文章</NButton>
        </RouterLink>
        <NButton quaternary @click="emit('toggleTheme')">{{ themeLabel }}</NButton>
      </div>
    </NLayoutHeader>

    <NLayoutContent class="shell-main">
      <slot />
      <NCard class="page-footer-card" embedded>
        这是可运行的原型工程，不包含真实接口调用与业务写入逻辑，仅用于确认页面结构与组件分层。
      </NCard>
    </NLayoutContent>
  </NLayout>
</template>
