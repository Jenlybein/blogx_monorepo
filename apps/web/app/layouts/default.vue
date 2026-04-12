<script setup lang="ts">
const siteStore = useSiteStore();

await siteStore.ensurePublicBootstrap();

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
