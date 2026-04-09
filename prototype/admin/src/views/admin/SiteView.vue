<template>
  <NGrid :cols="24" :x-gap="20" responsive="screen">
    <NGridItem :span="12">
      <NCard title="基础站点配置">
        <NSpace vertical :size="14">
          <NInput value="BlogX 开发者社区" />
          <NInput value="https://mock.blogx.dev/assets/logo.svg" />
          <NInput value="沪ICP备20260001号" />
          <NSelect :options="[{ label: '社区模式', value: 1 }, { label: '博客模式', value: 2 }]" :value="1" />
          <NInput
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            value="面向开发者的内容平台，包含文章、评论、私信、AI 写作协作与运营后台。"
          />
          <NButton type="primary">保存基础配置</NButton>
        </NSpace>
      </NCard>
    </NGridItem>
    <NGridItem :span="12">
      <NCard title="AI 运行配置">
        <NSpace vertical :size="14">
          <NSelect :options="[{ label: '启用', value: 'enabled' }, { label: '关闭', value: 'disabled' }]" value="enabled" />
          <NInput value="https://api.mock-ai.dev/v1" />
          <NInput value="gpt-5.4-mini" />
          <NInput value="gpt-5.4" />
          <NInput value="6000" />
          <NInput value="3000" />
          <NSpace>
            <NButton type="primary">保存 AI 配置</NButton>
            <NButton quaternary>测试连通性</NButton>
          </NSpace>
        </NSpace>
      </NCard>
    </NGridItem>
  </NGrid>
</template>

<script setup lang="ts">
import { NButton, NCard, NGrid, NGridItem, NInput, NSelect, NSpace } from "naive-ui";
</script>
