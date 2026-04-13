<script setup lang="ts">
import { NList, NListItem, NThing, NTag } from "naive-ui";
import { getLoginLogs } from "~/services/studio";
import { formatDateTimeLabel } from "~/utils/format";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const { data, pending, refresh } = await useAsyncData("studio-login-logs", () => getLoginLogs({}));

useSeoMeta({
  title: "个人中心 - 最近登录",
});
</script>

<template>
  <div class="page-stack">
    <StudioPageHeader
      title="最近登录"
      description="先把真实登录记录接出来，帮助你确认账号访问来源。原型里的“设备下线”按钮暂不伪造，因为当前接口集没有对应能力。"
      eyebrow="Security"
    />

    <section class="studio-list-card">
      <div class="studio-toolbar">
        <div class="muted text-sm">共 {{ data?.count ?? 0 }} 条登录记录</div>
        <button type="button" class="glass-badge" @click="refresh()">刷新记录</button>
      </div>

      <NList v-if="data?.list.length" class="mt-4">
        <NListItem v-for="item in data?.list" :key="item.id">
          <NThing :title="item.addr || item.ip" :description="item.ua">
            <template #header-extra>
              <NTag size="small">{{ item.ip }}</NTag>
            </template>
            <template #footer>
              <div class="studio-list-meta">
                <span>{{ formatDateTimeLabel(item.updated_at || item.created_at) }}</span>
              </div>
            </template>
          </NThing>
        </NListItem>
      </NList>
      <StudioEmptyState
        v-else
        title="还没有登录记录"
        :description="pending ? '正在读取登录日志…' : '如果后端日志已接通，新的登录记录会展示在这里。'"
        class="mt-5"
      />
    </section>
  </div>
</template>
