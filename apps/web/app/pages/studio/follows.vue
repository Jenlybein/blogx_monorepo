<script setup lang="ts">
import { NButton, NList, NListItem, NThing, NTag, useMessage } from "naive-ui";
import { unfollowUser } from "~/services/follow";
import { getFollowUsers } from "~/services/studio";
import { formatDateTimeLabel } from "~/utils/format";
import { isMutualFollow } from "~/utils/relation";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const { data, pending, refresh } = await useAsyncData("studio-follows", () => getFollowUsers({ page: 1, limit: 30 }));

async function removeFollow(id: string) {
  try {
    await unfollowUser(id);
    message.success("已取消关注");
    await refresh();
  } catch (error) {
    message.error(error instanceof Error ? error.message : "取消关注失败");
  }
}

useSeoMeta({
  title: "个人中心 - 关注",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="关注列表"
      description="把你主动关注的人集中到一个地方，方便回访主页、查看动态或快速取消关注。"
      eyebrow="Follow"
    />

    <section class="studio-list-card">
      <NList v-if="data?.list.length">
        <NListItem v-for="item in data?.list" :key="item.followed_user_id">
          <NThing :title="item.followed_nickname" :description="item.followed_abstract || '这个用户还没有填写简介。'">
            <template #header-extra>
              <NTag size="small">{{ isMutualFollow(item.relation) ? "互相关注" : "已关注" }}</NTag>
            </template>
            <template #footer>
              <div class="studio-list-meta">
                <span>{{ formatDateTimeLabel(item.follow_time) }}</span>
              </div>
            </template>
          </NThing>
          <template #suffix>
            <div class="flex flex-wrap gap-2">
              <NuxtLink :to="`/users/${item.followed_user_id}`" class="glass-badge">查看主页</NuxtLink>
              <NButton quaternary size="small" @click="removeFollow(item.followed_user_id)">取消关注</NButton>
            </div>
          </template>
        </NListItem>
      </NList>
      <StudioEmptyState
        v-else
        title="你还没有关注任何人"
        :description="pending ? '正在读取关注列表…' : '可以从作者主页或文章详情作者卡开始关注感兴趣的创作者。'"
      />
    </section>
  </div>
</template>
