<script setup lang="ts">
import { h } from "vue";
import { NAvatar, NButton, NCard, NDataTable, NGrid, NGridItem, NInput, NSelect, NSpace, NTag, NTimeline, NTimelineItem } from "naive-ui";

const reviewColumns = [
  { title: "文章", key: "title" },
  {
    title: "作者",
    key: "author",
    render: (row: { author: string; avatar: string }) =>
      h(NSpace, { align: "center", size: "small" }, { default: () => [h(NAvatar, { round: true, size: "small" }, { default: () => row.avatar }), h("span", row.author)] }),
  },
  {
    title: "状态",
    key: "status",
    render: (row: { status: string }) => h(NTag, { type: row.status === "需复审" ? "error" : "warning" }, { default: () => row.status }),
  },
  { title: "AI 诊断", key: "diagnose" },
  { title: "提交时间", key: "time" },
  {
    title: "操作",
    key: "actions",
    render: () => h(NSpace, null, { default: () => [h(NButton, { size: "small", type: "primary" }, { default: () => "通过" }), h(NButton, { size: "small", tertiary: true }, { default: () => "详情" })] }),
  },
];

const reviewData = [
  { title: "基于既有 OpenAPI 反向设计前端架构", author: "Aster", avatar: "AS", status: "审核中", diagnose: "结构完整，建议补风险说明", time: "今天 09:15" },
  { title: "用 SSE 实现编辑器内 AI 改写", author: "River", avatar: "RV", status: "审核中", diagnose: "命中 1 条内容重复提醒", time: "今天 08:42" },
  { title: "日志系统的 ClickHouse 查询模式", author: "Louis", avatar: "LO", status: "需复审", diagnose: "引用段落过长，建议人工确认", time: "昨天 21:04" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="审核筛选">
      <NGrid :cols="24" :x-gap="16" responsive="screen">
        <NGridItem :span="6"><NSelect :options="[{ label: '审核中', value: 'reviewing' }, { label: '已拒绝', value: 'rejected' }]" value="reviewing" /></NGridItem>
        <NGridItem :span="6"><NInput value="全部作者" /></NGridItem>
        <NGridItem :span="6"><NSelect :options="[{ label: '全部', value: 'all' }, { label: '高风险', value: 'high' }]" value="all" /></NGridItem>
        <NGridItem :span="6"><NInput value="2026-04-01 ~ 2026-04-08" /></NGridItem>
      </NGrid>
    </NCard>

    <NCard title="审核队列">
      <NDataTable :columns="reviewColumns" :data="reviewData" :pagination="false" />
    </NCard>

    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="12">
        <NCard title="当前选中文章">
          <h3>基于既有 OpenAPI 反向设计前端架构</h3>
          <p class="muted">摘要：从接口能力反推页面职责、组件拆分、状态边界和 API Integration Design。</p>
          <NSpace>
            <NButton type="primary">审核通过</NButton>
            <NButton tertiary type="error">驳回并备注</NButton>
          </NSpace>
        </NCard>
      </NGridItem>
      <NGridItem :span="12">
        <NCard title="处理记录">
          <NTimeline>
            <NTimelineItem content="09:15 作者提交审核" />
            <NTimelineItem content="09:16 AI 评分完成，总分 84，判定为优质文章" />
            <NTimelineItem content="09:18 运营人员打开审核详情" />
          </NTimeline>
        </NCard>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
