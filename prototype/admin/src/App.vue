<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider, type GlobalThemeOverrides } from "naive-ui";
import WorkspaceShell from "@/components/layout/WorkspaceShell.vue";

  const route = useRoute();
  const themeKey = "blogx-prototype-admin-theme";
  const currentTheme = ref<"light" | "dark">((window.localStorage.getItem(themeKey) as "light" | "dark") || "light");

watch(
  currentTheme,
  (value) => {
    document.body.classList.toggle("theme-dark", value === "dark");
    window.localStorage.setItem(themeKey, value);
  },
  { immediate: true },
);

const shell = computed(() => String(route.meta.shell || "admin"));
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
</script>

<template>
  <NConfigProvider :theme="currentTheme === 'dark' ? darkTheme : null" :theme-overrides="themeOverrides">
      <NDialogProvider>
        <NMessageProvider>
          <RouterView v-if="shell === 'auth'" />
          <WorkspaceShell
            v-else
            kind="admin"
            :title="title"
            :subtitle="subtitle"
            :breadcrumb="breadcrumb"
            :theme-label="themeLabel"
            @toggle-theme="toggleTheme"
          >
            <RouterView />
          </WorkspaceShell>
        </NMessageProvider>
      </NDialogProvider>
  </NConfigProvider>
</template>
