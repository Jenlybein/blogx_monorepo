<script setup lang="ts">
import {
  NAvatar,
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NList,
  NListItem,
  NSpace,
  NTag,
  NThing,
  NTimeline,
  NTimelineItem,
} from "naive-ui";
</script>

<template>
  <NGrid :cols="24" :x-gap="20" responsive="screen">
    <NGridItem :span="17">
      <NSpace vertical :size="20">
        <NCard size="large">
          <p class="eyebrow">Architecture / OpenAPI / Nuxt</p>
          <h2>基于既有 OpenAPI 反向设计前端架构：从页面到数据流的完整思路</h2>
          <NSpace align="center">
            <NSpace size="small" align="center">
              <NAvatar round size="small">AS</NAvatar>
              <strong>Aster</strong>
            </NSpace>
            <NTag>2026-04-08 发布</NTag>
            <NTag>22 分钟阅读</NTag>
            <NTag>1,284 浏览</NTag>
          </NSpace>
          <NSpace class="section-gap">
            <NButton type="primary">点赞 286</NButton>
            <NButton secondary>收藏 123</NButton>
            <NButton quaternary>分享链接</NButton>
          </NSpace>
        </NCard>

        <NCard title="正文内容" size="large">
          <NSpace vertical :size="18">
            <p>当后端接口已经确定，前端最容易犯的错不是不会做，而是照着接口名直接堆页面，最后导致模块边界混乱、状态散落、页面职责重叠。</p>
            <p>更稳妥的做法是把接口先按业务域归类，再从页面职责反推模块：页面只负责组织组合，业务组件承接交互细节，service 管调用，composable 管查询与副作用，store 只持有跨页面共享状态。</p>
            <div class="fake-code">packages/
  api-contract/
  api-client/
apps/
  web/
  admin/
packages/shared/
  constants/
  ui/</div>
            <p>在这套结构里，文章列表和日志列表虽然都具备分页筛选，但不建议直接抽成“万能列表页面”，而应该抽成复用查询模型与基础表格外壳。</p>
          </NSpace>
        </NCard>

        <NCard title="评论区" size="large">
          <NList>
            <NListItem>
              <NThing title="River" description="这一版把 store 只放跨页面状态说得很清楚，特别适合避免把每个列表都塞进 Pinia 的常见误区。">
                <template #avatar><NAvatar round>RV</NAvatar></template>
                <template #footer>
                  <NSpace>
                    <NButton quaternary size="small">点赞 18</NButton>
                    <NButton quaternary size="small">回复</NButton>
                  </NSpace>
                </template>
              </NThing>
            </NListItem>
            <NListItem>
              <NThing title="Louis" description="建议再强调一下 OpenAPI 不完全准确时，为什么不要全量依赖自动生成 runtime client。">
                <template #avatar><NAvatar round>LO</NAvatar></template>
              </NThing>
            </NListItem>
          </NList>
        </NCard>
      </NSpace>
    </NGridItem>

    <NGridItem :span="7">
      <NSpace vertical :size="20">
        <NCard title="作者信息">
          <NSpace align="center">
            <NAvatar round size="large">AS</NAvatar>
            <strong>Aster</strong>
          </NSpace>
          <p class="muted">前端架构师，关注 API 驱动设计、文档体验、复杂后台的结构整理。</p>
          <NSpace>
            <NTag>124 篇文章</NTag>
            <NTag>8.2k 粉丝</NTag>
          </NSpace>
          <NSpace class="section-gap">
            <NButton secondary>关注作者</NButton>
            <NButton quaternary>查看主页</NButton>
          </NSpace>
        </NCard>
        <NCard title="目录">
          <NTimeline>
            <NTimelineItem content="1. 为什么要反推页面结构" />
            <NTimelineItem content="2. 页面、组件、数据流三层关系" />
            <NTimelineItem content="3. API 调用层的分层策略" />
            <NTimelineItem content="4. 鉴权、刷新、错误处理" />
          </NTimeline>
        </NCard>
      </NSpace>
    </NGridItem>
  </NGrid>
</template>
