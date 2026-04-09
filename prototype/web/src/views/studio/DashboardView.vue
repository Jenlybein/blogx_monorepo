<script setup lang="ts">
import { computed } from "vue";
import { NAvatar, NButton, NCard, NGrid, NGridItem, NList, NListItem, NSpace, NTag, NThing } from "naive-ui";

const userDetail = {
  nickname: "River",
  place: "上海",
  codeAge: 27,
  viewCount: 18642,
  fansCount: 632,
  followCount: 118,
  homeStyleId: 2,
  favoritesVisibility: true,
  followersVisibility: true,
  fansVisibility: false,
};

const articleSummary = {
  draftCount: 12,
  pendingCount: 4,
  publishedCount: 36,
  favoriteFolderCount: 5,
  historyCount: 128,
  managedCommentCount: 42,
};

const messageSummary = {
  commentMsgCount: 7,
  diggFavorMsgCount: 6,
  privateMsgCount: 4,
  systemMsgCount: 3,
};

const visibilityTags = computed(() => [
  userDetail.favoritesVisibility ? "收藏夹公开" : "收藏夹私密",
  userDetail.followersVisibility ? "关注列表公开" : "关注列表私密",
  userDetail.fansVisibility ? "粉丝列表公开" : "粉丝列表私密",
]);

const accountSummaryStats = computed(() => [
  { label: "草稿", value: articleSummary.draftCount, note: "待继续编辑与补全封面" },
  { label: "已发布", value: articleSummary.publishedCount, note: `另有 ${articleSummary.pendingCount} 篇待审核` },
  { label: "累计阅读", value: "18.6k", note: `来自 users/detail.view_count = ${userDetail.viewCount}` },
  {
    label: "未读消息",
    value:
      messageSummary.commentMsgCount +
      messageSummary.diggFavorMsgCount +
      messageSummary.privateMsgCount +
      messageSummary.systemMsgCount,
    note: "评论、互动、私信与系统消息",
  },
  { label: "粉丝数", value: userDetail.fansCount, note: "来自 users/detail.fans_count" },
  { label: "关注数", value: userDetail.followCount, note: "关注中的作者与用户" },
  { label: "收藏夹数量", value: articleSummary.favoriteFolderCount, note: "我的收藏夹分组总数" },
  { label: "浏览记录", value: articleSummary.historyCount, note: "最近阅读与回访痕迹" },
]);

const recentActivities = [
  {
    title: "《基于既有 OpenAPI 反向设计前端架构》通过审核",
    description: "文章已发布到公开站点，并进入首页推荐流。",
    time: "今天 09:32",
    tag: "发布",
  },
  {
    title: "《页面职责与组件拆分》新增 18 条评论",
    description: "当前评论管理中有 7 条高价值互动待回复。",
    time: "昨天 21:14",
    tag: "互动",
  },
  {
    title: "收藏夹《前端架构设计》新增 9 篇文章",
    description: "最近一次收藏来自消息中心、原型设计与搜索体验主题。",
    time: "昨天 18:20",
    tag: "收藏",
  },
];

const favoriteFolders = [
  { name: "前端架构设计", count: 28, visibility: "公开" },
  { name: "编辑器与写作体验", count: 16, visibility: "公开" },
  { name: "消息中心交互", count: 11, visibility: "私密" },
];

const recentHistory = [
  { title: "SSE 在编辑器中的应用", time: "今天 10:08" },
  { title: "图片上传任务流的前端封装", time: "今天 08:42" },
  { title: "站内消息与私信模块结构整理", time: "昨天 22:16" },
];
</script>

<template>
  <NSpace vertical :size="20">
    <NGrid :cols="24" :x-gap="20" :y-gap="20" responsive="screen">
      <NGridItem :span="24" :xl="15">
        <NSpace vertical :size="20">
          <NCard class="dashboard-profile-card" title="账号摘要">
            <div class="dashboard-profile-card__body">
              <div class="dashboard-profile-card__identity">
                <NAvatar round :size="72">RV</NAvatar>
                <div>
                  <h3>River</h3>
                  <p class="muted">上海 · 站龄 {{ userDetail.codeAge }} 个月 · 主页样式 {{ userDetail.homeStyleId }}</p>
                  <div class="dashboard-chip-row">
                    <NTag v-for="tag in visibilityTags" :key="tag" round>{{ tag }}</NTag>
                  </div>
                </div>
              </div>
              <div class="dashboard-summary-grid">
                <div v-for="item in accountSummaryStats" :key="item.label" class="dashboard-kv">
                  <span class="muted">{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                  <p class="muted">{{ item.note }}</p>
                </div>
              </div>
            </div>
          </NCard>

          <NCard title="最近动态">
            <NList>
              <NListItem v-for="item in recentActivities" :key="item.title">
                <NThing :title="item.title" :description="item.description">
                  <template #footer>
                    <div class="profile-article-meta">
                      <span>{{ item.time }}</span>
                      <NTag size="small">{{ item.tag }}</NTag>
                    </div>
                  </template>
                </NThing>
              </NListItem>
            </NList>
          </NCard>

          <NCard title="收藏与浏览">
            <NGrid :cols="24" :x-gap="16" :y-gap="16" responsive="screen">
              <NGridItem :span="24" :m="12">
                <div class="dashboard-kv">
                  <span class="muted">浏览记录</span>
                  <strong>{{ articleSummary.historyCount }}</strong>
                  <p class="muted">对应 articles/history 的个人阅读痕迹。</p>
                </div>
              </NGridItem>
              <NGridItem :span="24" :m="12">
                <div class="dashboard-kv">
                  <span class="muted">评论管理</span>
                  <strong>{{ articleSummary.managedCommentCount }}</strong>
                  <p class="muted">对应 comments/man 的待处理与已处理评论。</p>
                </div>
              </NGridItem>
            </NGrid>
            <div class="section-gap">
              <NList>
                <NListItem v-for="item in recentHistory" :key="item.title">
                  <NThing :title="item.title" :description="item.time" />
                </NListItem>
              </NList>
            </div>
          </NCard>
        </NSpace>
      </NGridItem>

      <NGridItem :span="24" :xl="9">
        <NSpace vertical :size="20">
          <NCard title="内容状态">
            <div class="dashboard-summary-grid">
              <div class="dashboard-kv">
                <span class="muted">草稿</span>
                <strong>{{ articleSummary.draftCount }}</strong>
              </div>
              <div class="dashboard-kv">
                <span class="muted">待审核</span>
                <strong>{{ articleSummary.pendingCount }}</strong>
              </div>
              <div class="dashboard-kv">
                <span class="muted">已发布</span>
                <strong>{{ articleSummary.publishedCount }}</strong>
              </div>
              <div class="dashboard-kv">
                <span class="muted">收藏夹</span>
                <strong>{{ articleSummary.favoriteFolderCount }}</strong>
              </div>
            </div>
            <div class="section-gap">
              <RouterLink to="/studio/write">
                <NButton type="primary" block>创作文章</NButton>
              </RouterLink>
            </div>
          </NCard>

          <NCard title="消息概览">
            <NList>
              <NListItem>
                <NThing title="评论与回复" description="对应 sitemsg/user.comment_msg_count" />
                <template #suffix><strong>{{ messageSummary.commentMsgCount }}</strong></template>
              </NListItem>
              <NListItem>
                <NThing title="点赞与收藏" description="对应 sitemsg/user.digg_favor_msg_count" />
                <template #suffix><strong>{{ messageSummary.diggFavorMsgCount }}</strong></template>
              </NListItem>
              <NListItem>
                <NThing title="私信消息" description="对应 sitemsg/user.private_msg_count" />
                <template #suffix><strong>{{ messageSummary.privateMsgCount }}</strong></template>
              </NListItem>
              <NListItem>
                <NThing title="系统消息" description="对应 sitemsg/user.system_msg_count" />
                <template #suffix><strong>{{ messageSummary.systemMsgCount }}</strong></template>
              </NListItem>
            </NList>
          </NCard>

          <NCard title="我的收藏夹">
            <NList>
              <NListItem v-for="item in favoriteFolders" :key="item.name">
                <NThing :title="item.name" :description="`${item.count} 篇内容`" />
                <template #suffix><NTag size="small">{{ item.visibility }}</NTag></template>
              </NListItem>
            </NList>
          </NCard>
        </NSpace>
      </NGridItem>
    </NGrid>
  </NSpace>
</template>
