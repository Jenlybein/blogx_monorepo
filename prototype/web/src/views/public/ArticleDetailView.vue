<script setup lang="ts">
import {
  NAvatar,
  NButton,
  NCard,
  NGrid,
  NGridItem,
  NInput,
  NSpace,
  NTag,
  NTimeline,
  NTimelineItem,
} from "naive-ui";

type ReplyItem = {
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  highlight?: string;
};

type CommentItem = {
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  replies: ReplyItem[];
};

const quickCommentTags = ["接口设计", "数据流", "分页", "鉴权", "错误处理"];

const commentThreads: CommentItem[] = [
  {
    author: "River",
    avatar: "RV",
    time: "2026-04-09 21:18",
    content:
      "这一版把 store 只放跨页面状态说得很清楚，特别适合避免把每个列表都塞进 Pinia 的常见误区。要是能再补一段 route query 和查询状态怎么同步，就更完整了。",
    likes: 18,
    replies: [
      {
        author: "Aster",
        avatar: "AS",
        time: "2026-04-09 21:36",
        content:
          "这个点很关键，我后面准备把列表筛选和 URL 同步单独拉一段出来，避免页面刷新后状态丢失。",
        likes: 6,
        highlight: "作者回复",
      },
      {
        author: "Louis",
        avatar: "LO",
        time: "2026-04-09 22:04",
        content:
          "我也踩过这个坑，尤其是后台列表页，一旦筛选条件不进 URL，协作排查会很痛苦。",
        likes: 3,
      },
      {
        author: "Nina",
        avatar: "NI",
        time: "2026-04-09 22:18",
        content: "如果后面补这段，我建议顺手把 query 和分页参数的关系一起讲透，会更完整。",
        likes: 2,
      },
    ],
  },
  {
    author: "Louis",
    avatar: "LO",
    time: "2026-04-09 20:47",
    content:
      "建议再强调一下 OpenAPI 不完全准确时，为什么不要全量依赖自动生成 runtime client。否则团队会默认 schema 永远可信，最后把错误处理散在页面里。",
    likes: 9,
    replies: [
      {
        author: "River",
        avatar: "RV",
        time: "2026-04-09 21:02",
        content: "同意，尤其是业务失败仍然返回 200 这种接口，前端不自己 unwrap 很容易越写越乱。",
        likes: 4,
      },
    ],
  },
];
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
          <div class="article-comment-composer">
            <div class="article-comment-composer__head article-comment-composer__head--simple">
              <NTag round>{{ commentThreads.length + 4 }} 条评论</NTag>
            </div>

            <div class="article-comment-composer__body">
              <NAvatar round size="large">ME</NAvatar>
              <div class="article-comment-composer__main">
                <NInput
                  type="textarea"
                  placeholder="写下你对这篇文章的看法，也可以补充你的项目实践。"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                />
                <div class="article-comment-composer__footer">
                  <NSpace size="small">
                    <NTag v-for="tag in quickCommentTags" :key="tag" round size="small">{{ tag }}</NTag>
                  </NSpace>
                  <NSpace>
                    <NButton quaternary>取消</NButton>
                    <NButton type="primary">发表评论</NButton>
                  </NSpace>
                </div>
              </div>
            </div>
          </div>

          <div class="article-comment-thread">
            <div v-for="comment in commentThreads" :key="`${comment.author}-${comment.time}`" class="article-comment-item">
              <div class="article-comment-item__main">
                <NAvatar round size="large">{{ comment.avatar }}</NAvatar>
                <div class="article-comment-item__content">
                  <div class="article-comment-item__meta">
                    <strong>{{ comment.author }}</strong>
                    <span class="muted">{{ comment.time }}</span>
                  </div>
                  <p class="article-comment-item__text">{{ comment.content }}</p>
                  <NSpace size="small">
                    <NButton quaternary size="small">点赞 {{ comment.likes }}</NButton>
                    <NButton quaternary size="small">回复</NButton>
                  </NSpace>
                </div>
              </div>

              <div v-if="comment.replies.length" class="article-comment-replies">
                <div
                  v-for="reply in comment.replies"
                  :key="`${reply.author}-${reply.time}`"
                  class="article-comment-reply"
                  >
                  <NAvatar round size="small">{{ reply.avatar }}</NAvatar>
                  <div class="article-comment-reply__content">
                    <div class="article-comment-reply__meta">
                      <strong>{{ reply.author }}</strong>
                      <NTag v-if="reply.highlight" size="small" round type="success">{{ reply.highlight }}</NTag>
                      <span class="muted">{{ reply.time }}</span>
                    </div>
                    <p class="article-comment-item__text article-comment-item__text--reply">{{ reply.content }}</p>
                    <NSpace size="small">
                      <NButton quaternary size="tiny">点赞 {{ reply.likes }}</NButton>
                      <NButton quaternary size="tiny">回复</NButton>
                    </NSpace>
                  </div>
                </div>
                <div class="article-comment-replies__pager">
                  <NButton quaternary size="tiny" circle>&lt;</NButton>
                  <span class="muted">2 / {{ comment.replies.length }} 条回复</span>
                  <NButton quaternary size="tiny" circle>&gt;</NButton>
                </div>
              </div>
            </div>
          </div>
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
