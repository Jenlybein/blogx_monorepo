<script setup lang="ts">
import { NButton, NList, NListItem, NThing, NTag, useMessage } from "naive-ui";
import { followUser, unfollowUser } from "~/services/follow";
import { getFanUsers } from "~/services/studio";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const { data, pending, refresh } = await useAsyncData("studio-fans", () => getFanUsers({ page: 1, limit: 30 }));

async function toggleFollow(id: string, relation: number) {
  try {
    if (relation === 1 || relation === 3) {
      await unfollowUser(id);
      message.success("已取消回关");
    } else {
      await followUser(id);
      message.success("已回关");
    }
    await refresh();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "关注操作失败");
  }
}

useSeoMeta({
  title: "个人中心 - 粉丝",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="粉丝列表"
      description="把关注你的人拉成独立页面，方便做回关、回访主页和关系整理，而不是只在公开主页里被动展示一个数字。"
      eyebrow="Fans"
    />

    <section class="studio-list-card">
      <NList v-if="data?.list.length">
        <NListItem v-for="item in data?.list" :key="item.fans_user_id">
          <NThing :title="item.fans_nickname" :description="item.fans_abstract || '这个用户还没有填写简介。'">
            <template #header-extra>
              <NTag size="small">{{ item.relation === 3 ? "互相关注" : "关注了你" }}</NTag>
            </template>
            <template #footer>
              <div class="studio-list-meta">
                <span>{{ formatDateTimeLabel(item.follow_time) }}</span>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <div class="flex flex-wrap gap-2">
              <NuxtLink :to="`/users/${item.fans_user_id}`" class="glass-badge">查看主页</NuxtLink>
              <NButton quaternary size="small" @click="toggleFollow(item.fans_user_id, item.relation)">
                {{ item.relation === 3 ? "取消回关" : "回关" }}
              </NButton>
            </div>
          </template>
        </NListItem>
      </NList>
      <StudioEmptyState
        v-else
        title="你还没有粉丝"
        :description="pending ? '正在读取粉丝列表…' : '继续发布内容和参与互动后，这里会逐渐出现新的关系沉淀。'"
      />
    </section>
  </div>
</template>
