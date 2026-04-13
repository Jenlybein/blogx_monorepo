<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  eyebrow?: string;
}>();
</script>

<template>
  <section class="surface-card studio-hero">
    <div>
      <div class="eyebrow">{{ eyebrow || "Workspace" }}</div>
      <h1 class="page-title mt-2 text-balance">{{ title }}</h1>
      <p class="mt-3 max-w-3xl text-sm leading-7 muted">
        {{ description }}
      </p>
    </div>
    <slot />
  </section>
</template>
