<script setup lang="ts">
import { computed } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import { articleYearSeries } from "@/data/mock";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

const option = computed(() => ({
  tooltip: { trigger: "axis" },
  grid: { left: 24, right: 24, top: 24, bottom: 16, containLabel: true },
  xAxis: { type: "category", data: articleYearSeries.months },
  yAxis: { type: "value", splitLine: { lineStyle: { color: "#dbe4ee" } } },
  series: [
    {
      type: "bar",
      data: articleYearSeries.values,
      itemStyle: {
        color: "#155e75",
        borderRadius: [10, 10, 0, 0],
      },
      barWidth: 28,
    },
  ],
}));
</script>

<template>
  <VChart class="chart-view" :option="option" autoresize />
</template>
