<script setup lang="ts">
import AppFooter from "~/components/layout/AppFooter.vue";
import AppHeader from "~/components/layout/AppHeader.vue";
import AuthModal from "~/components/auth/AuthModal.vue";

const siteStore = useSiteStore();

void siteStore.ensurePublicBootstrap();

useHead(() => ({
  link: siteStore.seo?.icon
    ? [
        {
          rel: "icon",
          href: siteStore.seo.icon,
        },
      ]
    : [],
}));
</script>

<template>
  <div class="min-h-screen">
    <AppHeader />
    <main class="page-shell">
      <slot />
    </main>
    <AppFooter />
    <AuthModal />
  </div>
</template>
