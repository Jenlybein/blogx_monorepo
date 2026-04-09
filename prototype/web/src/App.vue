<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider, type GlobalThemeOverrides } from "naive-ui";
import AuthModal from "@/components/auth/AuthModal.vue";
import PublicShell from "@/components/layout/PublicShell.vue";
import WorkspaceShell from "@/components/layout/WorkspaceShell.vue";
import { mockPublicUser, type PublicUser } from "@/data/mock";

const route = useRoute();
const authVisible = ref(false);
const currentUser = ref<PublicUser | null>(null);
const themeKey = "blogx-prototype-web-theme";
const currentTheme = ref<"light" | "dark">((window.localStorage.getItem(themeKey) as "light" | "dark") || "light");

watch(
  currentTheme,
  (value) => {
    document.body.classList.toggle("theme-dark", value === "dark");
    window.localStorage.setItem(themeKey, value);
  },
  { immediate: true },
);

const shell = computed(() => (route.meta.shell as "public" | "studio" | "write") || "public");
const title = computed(() => String(route.meta.title || ""));
const subtitle = computed(() => String(route.meta.subtitle || ""));
const breadcrumb = computed(() => String(route.meta.breadcrumb || ""));
const themeLabel = computed(() => (currentTheme.value === "dark" ? "切换明亮" : "切换暗黑"));

const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: "18px",
    borderRadiusSmall: "12px",
    primaryColor: "#0f766e",
    primaryColorHover: "#115e59",
    primaryColorPressed: "#0c5e57",
  },
  Card: {
    borderRadius: "22px",
  },
};

function toggleTheme() {
  currentTheme.value = currentTheme.value === "dark" ? "light" : "dark";
}

function handleAuthenticated() {
  currentUser.value = mockPublicUser;
}
</script>

<template>
  <NConfigProvider :theme="currentTheme === 'dark' ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="app-root">
      <NDialogProvider>
        <NMessageProvider>
          <PublicShell
            v-if="shell === 'public'"
            :current-user="currentUser"
            :title="title"
            :subtitle="subtitle"
            :theme-label="themeLabel"
            @toggle-theme="toggleTheme"
            @open-auth="authVisible = true"
          >
            <RouterView />
          </PublicShell>

        <WorkspaceShell
          v-else-if="shell === 'studio'"
          kind="studio"
          :current-user="currentUser"
          :title="title"
            :subtitle="subtitle"
            :breadcrumb="breadcrumb"
            :theme-label="themeLabel"
            @toggle-theme="toggleTheme"
            @open-auth="authVisible = true"
        >
          <RouterView />
        </WorkspaceShell>

        <RouterView v-else />

        <AuthModal v-model:show="authVisible" @authenticated="handleAuthenticated" />
      </NMessageProvider>
      </NDialogProvider>
    </div>
  </NConfigProvider>
</template>
