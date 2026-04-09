<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import { growthSeries } from "@/data/mock";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent]);

const option = computed(() => ({
  tooltip: { trigger: "axis" },
  legend: { top: 0 },
  grid: { left: 24, right: 24, top: 44, bottom: 16, containLabel: true },
  xAxis: { type: "category", data: growthSeries.dates },
  yAxis: { type: "value", splitLine: { lineStyle: { color: "#dbe4ee" } } },
  series: [
    {
      name: "新增文章",
      type: "line",
      smooth: true,
      data: growthSeries.articles,
      areaStyle: { color: "rgba(15,118,110,0.1)" },
      color: "#0f766e",
    },
    {
      name: "新增用户",
      type: "line",
      smooth: true,
      data: growthSeries.users,
      areaStyle: { color: "rgba(217,119,6,0.08)" },
      color: "#d97706",
    },
  ],
}));
</script>

<template>
  <VChart class="chart-view" :option="option" autoresize />
</template>
