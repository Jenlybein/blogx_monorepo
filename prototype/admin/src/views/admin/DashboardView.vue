<script setup lang="ts">
import { NCard, NGrid, NGridItem, NList, NListItem, NSpace, NStatistic, NTag, NThing } from "naive-ui";
import GrowthLineChart from "@/components/charts/GrowthLineChart.vue";
import ArticleYearChart from "@/components/charts/ArticleYearChart.vue";

const metrics = [
  { label: "总流量", value: "128k", note: "近 7 天 UV / PV" },
  { label: "新增用户", value: "73", note: "注册与 QQ 登录合计" },
  { label: "新增文章", value: "45", note: "含草稿、审核中、已发布" },
  { label: "消息总量", value: "932", note: "站内信 + 全局通知" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NGrid :cols="24" :x-gap="16" responsive="screen">
      <NGridItem v-for="metric in metrics" :key="metric.label" :span="6">
        <NCard class="metric-card">
          <NStatistic :label="metric.label" :value="metric.value" />
          <p class="muted">{{ metric.note }}</p>
        </NCard>
      </NGridItem>
    </NGrid>

    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="12">
        <NCard title="增长趋势"><GrowthLineChart /></NCard>
      </NGridItem>
      <NGridItem :span="12">
        <NCard title="年度文章分布"><ArticleYearChart /></NCard>
      </NGridItem>
    </NGrid>

    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="17">
        <NCard title="待处理事项">
          <NList>
            <NListItem>
              <NThing title="文章审核队列" description="4 篇待审，其中 1 篇命中 AI 诊断高风险" />
              <template #suffix><RouterLink to="/review"><NTag>去处理</NTag></RouterLink></template>
            </NListItem>
            <NListItem>
              <NThing title="全局通知过期清理" description="有 3 条过期通知待删除" />
              <template #suffix><NTag>查看</NTag></template>
            </NListItem>
            <NListItem>
              <NThing title="图片审核异常" description="2 个上传任务长时间停留在 reviewing" />
              <template #suffix><RouterLink to="/media"><NTag>去处理</NTag></RouterLink></template>
            </NListItem>
          </NList>
        </NCard>
      </NGridItem>
      <NGridItem :span="7">
        <NCard title="运行概况">
          <NList>
            <NListItem><NThing title="API 服务" /><template #suffix><NTag type="success">正常</NTag></template></NListItem>
            <NListItem><NThing title="搜索服务" /><template #suffix><NTag type="success">正常</NTag></template></NListItem>
            <NListItem><NThing title="AI 服务" /><template #suffix><NTag type="warning">降级</NTag></template></NListItem>
          </NList>
        </NCard>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
