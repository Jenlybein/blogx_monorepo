<script setup lang="ts">
import { NButton, NCard, NGrid, NGridItem, NInput, NSelect, NSpace, NTag } from "naive-ui";

const categoryOptions = [
  { label: "全部内容", value: "all" },
  { label: "教程", value: "tutorial" },
  { label: "架构复盘", value: "architecture" },
  { label: "工具实践", value: "tooling" },
];
</script>

<template>
  <NGrid :cols="24" :x-gap="20" responsive="screen">
    <NGridItem :span="7">
      <NSpace vertical :size="20">
        <NCard title="筛选条件">
          <NSpace vertical>
            <NSelect :options="categoryOptions" value="all" />
            <NInput value="全部作者" />
            <NSelect
              :options="[
                { label: '最新发布', value: 'latest' },
                { label: '最多点赞', value: 'digg' },
                { label: '最多收藏', value: 'favor' },
              ]"
              value="latest"
            />
            <NSpace>
              <NButton type="primary">应用筛选</NButton>
              <NButton quaternary>重置</NButton>
            </NSpace>
          </NSpace>
        </NCard>
        <NCard title="分类导航">
          <NSpace>
            <NTag type="success">前端架构</NTag>
            <NTag>工程化</NTag>
            <NTag>后端协作</NTag>
            <NTag>性能优化</NTag>
            <NTag>测试体系</NTag>
          </NSpace>
        </NCard>
      </NSpace>
    </NGridItem>

    <NGridItem :span="17">
      <NCard title="共 248 篇文章" size="large">
        <NGrid :cols="24" :x-gap="16" :y-gap="16" responsive="screen">
          <NGridItem v-for="index in 4" :key="index" :span="12">
            <NCard embedded>
              <div
                class="article-cover"
                :class="{
                  'article-cover--warm': index === 2,
                  'article-cover--cool': index === 3,
                  'article-cover--violet': index === 4,
                }"
              />
              <NSpace class="section-gap">
                <NTag>分类：架构设计</NTag>
                <NTag>标签：OpenAPI、Nuxt</NTag>
              </NSpace>
              <h3>接口既定时，前端该如何反向设计页面结构</h3>
              <p class="muted">强调页面职责、列表与详情状态边界、service/composable/store 的拆法，以及如何避免过度抽象。</p>
              <NSpace>
                <RouterLink to="/article/demo">
                  <NButton quaternary>查看详情</NButton>
                </RouterLink>
                <NButton secondary>收藏</NButton>
              </NSpace>
            </NCard>
          </NGridItem>
        </NGrid>
      </NCard>
    </NGridItem>
  </NGrid>
</template>
