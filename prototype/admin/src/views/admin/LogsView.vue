<script setup lang="ts">
import { h } from "vue";
import { NCard, NDataTable, NGrid, NGridItem, NInput, NSpace, NTabPane, NTabs, NTag, NTimeline, NTimelineItem } from "naive-ui";

const columns = [
  { title: "时间", key: "time" },
  { title: "级别", key: "level", render: (row: { level: string }) => h(NTag, { type: row.level === "error" ? "error" : row.level === "warn" ? "warning" : "success" }, { default: () => row.level }) },
  { title: "请求", key: "request" },
  { title: "用户", key: "user" },
  { title: "摘要", key: "summary" },
];

const rows = [
  { time: "10:24:33", level: "error", request: "GET /api/articles", user: "uid: 18", summary: "token refresh failed once, request replay success" },
  { time: "10:18:12", level: "warn", request: "POST /api/ai/overwrite", user: "uid: 26", summary: "upstream timeout after 12s" },
  { time: "09:42:05", level: "info", request: "POST /api/users/login", user: "uid: 3", summary: "login success with password" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="日志类型">
      <NTabs type="segment">
        <NTabPane name="runtime" tab="运行日志" />
        <NTabPane name="login" tab="登录日志" />
        <NTabPane name="action" tab="审计日志" />
      </NTabs>
      <NGrid class="section-gap" :cols="24" :x-gap="16" responsive="screen">
        <NGridItem :span="6"><NInput value="2026-04-08 00:00:00" /></NGridItem>
        <NGridItem :span="6"><NInput value="2026-04-08 23:59:59" /></NGridItem>
        <NGridItem :span="6"><NInput value="api / error" /></NGridItem>
        <NGridItem :span="6"><NInput value="/api/articles" /></NGridItem>
      </NGrid>
    </NCard>

    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="16">
        <NCard title="日志列表">
          <NDataTable :columns="columns" :data="rows" :pagination="false" />
        </NCard>
      </NGridItem>
      <NGridItem :span="8">
        <NCard title="日志详情面板">
          <NTimeline>
            <NTimelineItem content="trace_id：7d30ca82f0f249c4a3af12f7" />
            <NTimelineItem content="message：refresh token invalid, request retried after silent logout" />
            <NTimelineItem content='extra_json：{ "path": "/api/articles", "status_code": 200, "biz_code": 1001 }' />
          </NTimeline>
        </NCard>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
