<script setup lang="ts">
import { IconEye, IconHeart, IconMessageCircle2, IconThumbUp } from "@tabler/icons-vue";
import { NAvatar, NButton } from "naive-ui";
import type { UserBaseInfo } from "~/types/api";
import { formatCount } from "~/utils/format";

const props = defineProps<{
  profile: UserBaseInfo;
  isSelf?: boolean;
  relationText?: string;
  actionDisabled?: boolean;
  actionActive?: boolean;
}>();

const emit = defineEmits<{
  follow: [];
}>();
</script>

<template>
  <div class="profile-hero">
    <div class="profile-hero-main">
      <NAvatar class="profile-hero-avatar" :size="80" :src="profile.avatar || undefined">
        {{ profile.nickname.slice(0, 1).toUpperCase() }}
      </NAvatar>

      <div>
        <div class="text-4xl font-semibold tracking-[-0.04em]">{{ profile.nickname }}</div>
        <p class="mt-3 max-w-2xl text-[15px] leading-7 muted">
          {{ profile.abstract || "视当下为结果，便会绝望；视其为过程，则仍有转机。" }}
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-4 text-sm muted">
          <span class="inline-flex items-center gap-1.5"><IconThumbUp :size="16" /> 点赞 {{ formatCount(profile.digg_count || 0) }}</span>
          <span class="inline-flex items-center gap-1.5"><IconEye :size="16" /> 阅读 {{ formatCount(profile.view_count) }}</span>
          <span class="inline-flex items-center gap-1.5"><IconHeart :size="16" /> 收藏 {{ formatCount(profile.favor_count || 0) }}</span>
          <span class="inline-flex items-center gap-1.5"><IconMessageCircle2 :size="16" /> 评论 {{ formatCount(profile.comment_count || 0) }}</span>
        </div>
      </div>
    </div>

    <NButton
      v-if="!isSelf"
      :type="actionActive ? 'default' : 'primary'"
      :secondary="actionActive"
      round
      :disabled="actionDisabled"
      @click="emit('follow')"
    >
      {{ relationText || "关注作者" }}
    </NButton>
    <NButton v-else secondary round @click="navigateTo('/search')">查看站内内容</NButton>
  </div>
</template>
