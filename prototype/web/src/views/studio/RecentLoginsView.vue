<script setup lang="ts">
import { NButton, NCard, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";

const sessions = [
  {
    title: "Chrome / Windows",
    meta: "上海 · 今天 10:18",
    status: "当前设备",
    statusType: "success" as const,
    action: "",
  },
  {
    title: "Edge / macOS",
    meta: "杭州 · 昨天 21:14",
    status: "异常提醒",
    statusType: "warning" as const,
    action: "下线",
  },
  {
    title: "Safari / iPhone",
    meta: "苏州 · 04-08 08:42",
    status: "已验证",
    statusType: "info" as const,
    action: "",
  },
  {
    title: "Chrome / Ubuntu",
    meta: "深圳 · 04-07 19:26",
    status: "历史设备",
    statusType: "default" as const,
    action: "下线",
  },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="最近登录设备">
      <NList>
        <NListItem v-for="session in sessions" :key="`${session.title}-${session.meta}`">
          <NThing :title="session.title" :description="session.meta" />
          <template #suffix>
            <NSpace align="center">
              <NTag :type="session.statusType">{{ session.status }}</NTag>
              <NButton v-if="session.action" size="small" tertiary type="error">{{ session.action }}</NButton>
            </NSpace>
          </template>
        </NListItem>
      </NList>
    </NCard>
  </NSpace>
</template>
