<script setup lang="ts">
import { h } from "vue";
import { NButton, NCard, NDataTable, NGrid, NGridItem, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";

const columns = [
  { title: "资源", key: "name" },
  { title: "对象键", key: "key" },
  {
    title: "状态",
    key: "status",
    render: (row: { status: string }) => h(NTag, { type: row.status === "pass" ? "success" : row.status === "review" ? "warning" : "default" }, { default: () => row.status }),
  },
  { title: "引用位置", key: "refs" },
  { title: "操作", key: "action", render: () => h(NButton, { size: "small", quaternary: true }, { default: () => "查看" }) },
];

const rows = [
  { name: "openapi-layout-cover.png", key: "article/2026/04/openapi-layout.png", status: "pass", refs: "文章封面、推荐位" },
  { name: "aster-avatar.webp", key: "avatar/aster.webp", status: "orphaned", refs: "无引用" },
  { name: "spring-banner.jpg", key: "banner/spring-banner.jpg", status: "review", refs: "首页轮播" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NGrid :cols="24" :x-gap="20" responsive="screen">
      <NGridItem :span="12">
        <NCard title="上传任务">
          <template #header-extra><NButton type="primary">新建上传任务</NButton></template>
          <NList>
            <NListItem>
              <NThing title="cover-openapi-layout.png" description="状态：ready / provider: qiniu" />
              <template #suffix><NTag type="success">可用</NTag></template>
            </NListItem>
            <NListItem>
              <NThing title="avatar-aster.webp" description="状态：pending / hash 去重命中" />
              <template #suffix><NTag>跳过上传</NTag></template>
            </NListItem>
            <NListItem>
              <NThing title="banner-spring-release.jpg" description="状态：reviewing / 等待审核回调" />
              <template #suffix><NTag type="warning">审核中</NTag></template>
            </NListItem>
          </NList>
        </NCard>
      </NGridItem>
      <NGridItem :span="12">
        <NCard title="轮播运营">
          <NGrid :cols="24" :x-gap="16" responsive="screen">
            <NGridItem :span="12">
              <NCard embedded>
                <div class="banner-cover"></div>
                <p class="muted section-gap">首页主专题轮播 / 已展示</p>
              </NCard>
            </NGridItem>
            <NGridItem :span="12">
              <NCard embedded>
                <div class="banner-cover banner-cover--alt"></div>
                <p class="muted section-gap">活动轮播 / 预排期</p>
              </NCard>
            </NGridItem>
          </NGrid>
        </NCard>
      </NGridItem>
    </NGrid>

    <NCard title="资源库">
      <NDataTable :columns="columns" :data="rows" :pagination="false" />
    </NCard>
  </NSpace>
</template>
