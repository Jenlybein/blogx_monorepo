<script setup lang="ts">
import { computed, ref } from "vue";
import {
  NAvatar,
  NButton,
  NCard,
  NInput,
  NList,
  NListItem,
  NSpace,
  NTag,
  NThing,
  NVirtualList,
} from "naive-ui";

type InboxTab = "site" | "global" | "chat";
type SiteCategory = "comment" | "diggFavor" | "system";

type SiteMessage = {
  id: number;
  category: SiteCategory;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  avatar?: string;
};

type GlobalNotice = {
  id: number;
  title: string;
  description: string;
  time: string;
  tag: string;
  unread?: boolean;
};

type ChatSession = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  relation?: "friend" | "fan" | "following";
  unread: number;
  preview: string;
  time: string;
};

type ChatMessage = {
  id: number;
  from: "self" | "other";
  content: string;
  time: string;
};

const CHAT_SESSION_ITEM_HEIGHT = 76;
const CHAT_SESSION_VISIBLE_COUNT = 7;
const relationLabelMap = {
  friend: "好友",
  fan: "粉丝",
  following: "关注",
} as const;

function getRelationLabel(relation?: ChatSession["relation"]) {
  return relation ? relationLabelMap[relation] : "";
}

const activeTab = ref<InboxTab>("site");
const activeSiteCategory = ref<SiteCategory>("comment");
const activeChatSession = ref<string | null>(null);
const chatKeyword = ref("");
const draftMessage = ref("我晚上补进去，顺便把错误处理分类一起整理。");

const siteCategories = [
  { key: "comment" as const, label: "评论与回复", count: 7, hint: "查看读者评论、回复和楼中互动" },
  { key: "diggFavor" as const, label: "点赞与收藏", count: 6, hint: "聚合文章点赞、收藏和相关反馈" },
  { key: "system" as const, label: "审核与系统", count: 3, hint: "查看审核状态、公告和安全提醒" },
];

const siteMessages: SiteMessage[] = [
  {
    id: 1,
    category: "comment",
    title: "River 回复了你的文章",
    description: "“store 只放跨页面状态”这条原则很关键，后面可以再补个例子。",
    time: "今天 10:12",
    unread: true,
    avatar: "RV",
  },
  {
    id: 2,
    category: "comment",
    title: "Aster 评论了《页面职责与组件拆分》",
    description: "建议把搜索页和作者主页的数据流再拆开说明，会更好落地。",
    time: "今天 08:40",
    unread: true,
    avatar: "AS",
  },
  {
    id: 3,
    category: "diggFavor",
    title: "Louis 收藏了你的文章",
    description: "文章：《基于既有 OpenAPI 反向设计前端架构》",
    time: "昨天 18:26",
    avatar: "LO",
  },
  {
    id: 4,
    category: "diggFavor",
    title: "7 位读者点赞了《消息中心结构设计》",
    description: "互动增长明显，建议补充站内消息筛选与已读管理。",
    time: "昨天 11:08",
    unread: true,
  },
  {
    id: 5,
    category: "system",
    title: "你的文章已通过审核并发布",
    description: "《Nuxt 3 的 API 调用层如何拆》已进入首页推荐池。",
    time: "昨天 09:32",
    unread: true,
  },
  {
    id: 6,
    category: "system",
    title: "账号安全提醒",
    description: "检测到一台新设备登录，请确认是否为本人操作。",
    time: "04-07 22:14",
  },
];

const globalNotices: GlobalNotice[] = [
  {
    id: 1,
    title: "消息中心交互升级说明",
    description: "站内消息、全局通知、私信已拆分为三套独立容器，便于后续接真实接口。",
    time: "今天 09:00",
    tag: "产品公告",
    unread: true,
  },
  {
    id: 2,
    title: "搜索页即将支持更多排序方式",
    description: "后续会增加最新发布、互动热度与 AI 推荐入口。",
    time: "昨天 15:10",
    tag: "功能更新",
  },
  {
    id: 3,
    title: "开发者写作训练营开始报名",
    description: "本周开放 30 个名额，参与者将获得首页资源位和专题曝光。",
    time: "04-07 13:20",
    tag: "活动",
    unread: true,
  },
  {
    id: 4,
    title: "封面资源规范更新",
    description: "首页信息流封面建议使用 192×128，避免首屏裁切异常。",
    time: "04-06 11:18",
    tag: "运营提醒",
  },
  {
    id: 5,
    title: "评论区治理规则同步",
    description: "近期将加强灌水与重复评论检测，请注意互动内容质量。",
    time: "04-05 20:30",
    tag: "规则提醒",
  },
];

const chatSessionSeeds: ChatSession[] = [
  {
    id: "river",
    name: "River",
    role: "平台协作 / 搜索链路",
    avatar: "RV",
    relation: "friend",
    unread: 2,
    preview: "可以，再补一版分页与 token 失效处理的封装片段就很完整了。",
    time: "今天 10:12",
  },
  {
    id: "aster",
    name: "Aster",
    role: "前端架构 / 文档体验",
    avatar: "AS",
    relation: "fan",
    unread: 0,
    preview: "发布弹窗可以再贴近社区站一点。",
    time: "昨天 22:08",
  },
  {
    id: "louis",
    name: "Louis",
    role: "运营后台 / 数据看板",
    avatar: "LO",
    relation: "following",
    unread: 1,
    preview: "后台日志页我先补筛选条件，你这边继续把原型收细。",
    time: "昨天 18:26",
  },
];

const chatSessions: ChatSession[] = Array.from({ length: 24 }, (_, index) => {
  const seed = chatSessionSeeds[index % chatSessionSeeds.length];
  const serial = index + 1;

  return {
    ...seed,
    id: `${seed.id}-${serial}`,
    name: index < chatSessionSeeds.length ? seed.name : `${seed.name} ${serial}`,
    relation: serial % 4 === 0 ? undefined : seed.relation,
    unread: serial % 5 === 0 ? 0 : seed.unread + (serial % 3),
    time:
      serial % 4 === 0
        ? `04-${(serial % 9) + 1} 1${serial % 6}:2${serial % 10}`
        : serial % 3 === 0
          ? `昨天 ${10 + (serial % 10)}:${(serial * 3) % 60}`.replace(/:(\d)$/, ":0$1")
          : `今天 ${9 + (serial % 8)}:${(serial * 7) % 60}`.replace(/:(\d)$/, ":0$1"),
    preview:
      index < chatSessionSeeds.length
        ? seed.preview
        : `${seed.preview.slice(0, 16)}，第 ${serial} 条会话用于虚拟滚动预览。`,
  };
});

const chatMessages: Record<string, ChatMessage[]> = {
  river: [
    {
      id: 1,
      from: "other",
      content: "这篇关于 API Integration Design 的内容很适合做团队内部规范。",
      time: "10:02",
    },
    {
      id: 2,
      from: "self",
      content: "我准备再补一个 api-client 目录示例，让迁移路径更清楚。",
      time: "10:08",
    },
    {
      id: 3,
      from: "other",
      content: "可以，再补一版分页与 token 失效处理的封装片段就很完整了。",
      time: "10:12",
    },
  ],
  aster: [
    {
      id: 1,
      from: "other",
      content: "账号设置页可以进一步贴近资料表单的排版，不要卡片堆太多。",
      time: "昨天 21:42",
    },
    {
      id: 2,
      from: "self",
      content: "收到，我会把绑定信息也收成表单列表行。",
      time: "昨天 22:08",
    },
  ],
  louis: [
    {
      id: 1,
      from: "other",
      content: "后台日志页我先补筛选条件，你这边继续把原型收细。",
      time: "昨天 18:14",
    },
    {
      id: 2,
      from: "self",
      content: "好，消息中心这边我会按站内消息、全局通知、私信重新拆。",
      time: "昨天 18:26",
    },
  ],
};

const currentSiteCategory = computed(() =>
  siteCategories.find((item) => item.key === activeSiteCategory.value),
);

const filteredSiteMessages = computed(() =>
  siteMessages.filter((item) => item.category === activeSiteCategory.value),
);

const currentChatSession = computed(
  () => chatSessions.find((item) => item.id === activeChatSession.value) ?? null,
);

const filteredChatSessions = computed(() => {
  const keyword = chatKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return chatSessions;
  }

  return chatSessions.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.preview.toLowerCase().includes(keyword),
  );
});

const chatSessionListHeight = computed(
  () => `${Math.min(filteredChatSessions.value.length, CHAT_SESSION_VISIBLE_COUNT) * CHAT_SESSION_ITEM_HEIGHT}px`,
);

const currentChatMessages = computed(() => {
  if (!activeChatSession.value) {
    return [];
  }
  return chatMessages[activeChatSession.value] ?? [];
});
</script>

<template>
  <NSpace vertical :size="20">
    <NCard title="消息中心">
      <div class="inbox-switcher">
        <button
          v-for="item in [
            { key: 'site', label: '站内消息', hint: '评论、点赞收藏、审核系统' },
            { key: 'global', label: '全局通知', hint: '公告、活动、运营提醒' },
            { key: 'chat', label: '私信', hint: '会话、消息记录、实时沟通' },
          ]"
          :key="item.key"
          class="inbox-switcher__item"
          :class="{ 'inbox-switcher__item--active': activeTab === item.key }"
          @click="activeTab = item.key as InboxTab"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.hint }}</span>
        </button>
      </div>
    </NCard>

    <NCard v-if="activeTab === 'site'" class="inbox-chat-panel inbox-chat-panel--site" content-style="padding: 0">
      <div class="inbox-chat-layout inbox-chat-layout--site">
        <aside class="inbox-chat-sidebar inbox-chat-sidebar--site">
          <div class="inbox-chat-session-list">
            <button
              v-for="item in siteCategories"
              :key="item.key"
              class="inbox-chat-session-item"
              :class="{ 'inbox-chat-session-item--active': activeSiteCategory === item.key }"
              @click="activeSiteCategory = item.key"
            >
              <div class="inbox-chat-session inbox-chat-session--compact">
                <div class="inbox-chat-session__body inbox-site-category">
                  <div class="inbox-chat-session__top">
                    <strong class="inbox-chat-session__name">{{ item.label }}</strong>
                    <span class="inbox-site-category__count">{{ item.count }}</span>
                  </div>
                  <span class="inbox-chat-session__preview muted">{{ item.hint }}</span>
                </div>
              </div>
            </button>
          </div>
        </aside>

        <section class="inbox-chat-content">
          <header class="inbox-chat-content__header inbox-chat-content__header--with-actions inbox-chat-content__header--site">
            <div>
              <h3>{{ currentSiteCategory?.label ?? "站内消息" }}</h3>
              <p class="muted">{{ currentSiteCategory?.hint }}</p>
            </div>
            <div class="inbox-chat-content__actions">
              <NButton quaternary>全部标为已读</NButton>
              <NButton quaternary>清空当前分类</NButton>
            </div>
          </header>

          <div class="inbox-chat-content__messages inbox-chat-content__messages--list inbox-chat-content__messages--site">
            <NList>
              <NListItem v-for="item in filteredSiteMessages" :key="item.id">
                <NThing :title="item.title" :description="item.description">
                  <template v-if="item.avatar" #avatar>
                    <NAvatar round>{{ item.avatar }}</NAvatar>
                  </template>
                  <template #footer>
                    <div class="inbox-message-meta">
                      <span>{{ item.time }}</span>
                      <NTag v-if="item.unread" type="warning" size="small">未读</NTag>
                    </div>
                  </template>
                </NThing>
              </NListItem>
            </NList>
          </div>
        </section>
      </div>
    </NCard>

    <NCard v-else-if="activeTab === 'global'" title="全局通知">
      <template #header-extra><NButton quaternary>全部已读</NButton></template>
      <div class="inbox-notice-list">
        <article v-for="item in globalNotices" :key="item.id" class="inbox-notice-item">
          <div class="inbox-notice-item__head">
            <div class="inbox-notice-item__title">
              <strong>{{ item.title }}</strong>
              <NTag size="small">{{ item.tag }}</NTag>
              <NTag v-if="item.unread" type="warning" size="small">未读</NTag>
            </div>
            <span class="muted">{{ item.time }}</span>
          </div>
          <p class="muted">{{ item.description }}</p>
        </article>
      </div>
    </NCard>

    <NCard v-else class="inbox-chat-panel" content-style="padding: 0">
      <div class="inbox-chat-layout">
        <aside class="inbox-chat-sidebar">
          <div class="inbox-chat-sidebar__search">
            <NInput v-model:value="chatKeyword" placeholder="搜索联系人" clearable />
          </div>

          <div
            class="inbox-chat-session-list inbox-chat-session-list--virtual"
            :style="{ height: chatSessionListHeight, maxHeight: chatSessionListHeight }"
          >
            <NVirtualList
              :items="filteredChatSessions"
              :item-size="CHAT_SESSION_ITEM_HEIGHT"
              key-field="id"
              class="inbox-chat-virtual-list"
              style="height: 100%"
            >
              <template #default="{ item: session }">
                <button
                  class="inbox-chat-session-item"
                  :class="{ 'inbox-chat-session-item--active': activeChatSession === session.id }"
                  @click="activeChatSession = session.id"
                >
                  <div class="inbox-chat-session">
                    <span class="inbox-chat-session__avatar">
                      <NAvatar round :size="42">{{ session.avatar }}</NAvatar>
                    </span>
                    <div class="inbox-chat-session__body">
                      <div class="inbox-chat-session__top">
                        <div class="inbox-chat-session__identity">
                          <strong class="inbox-chat-session__name">{{ session.name }}</strong>
                          <span
                            v-if="session.relation"
                            class="inbox-chat-session__relation"
                            :class="`inbox-chat-session__relation--${session.relation}`"
                          >
                            {{ getRelationLabel(session.relation) }}
                          </span>
                        </div>
                        <span class="inbox-chat-session__time muted">{{ session.time }}</span>
                      </div>
                      <span class="inbox-chat-session__preview muted">{{ session.preview }}</span>
                    </div>
                  </div>
                  <NTag v-if="session.unread" round type="error" class="inbox-chat-session__badge">
                    {{ session.unread }}
                  </NTag>
                </button>
              </template>
            </NVirtualList>
          </div>
        </aside>

        <section class="inbox-chat-content">
          <template v-if="currentChatSession">
            <header class="inbox-chat-content__header">
              <div>
                <div class="inbox-chat-content__identity">
                  <h3>与 {{ currentChatSession.name }} 的私信</h3>
                  <span
                    v-if="currentChatSession.relation"
                    class="inbox-chat-session__relation"
                    :class="`inbox-chat-session__relation--${currentChatSession.relation}`"
                  >
                    {{ getRelationLabel(currentChatSession.relation) }}
                  </span>
                </div>
                <p class="muted">{{ currentChatSession.time }}</p>
              </div>
            </header>

            <div class="inbox-chat-content__messages">
              <div
                v-for="item in currentChatMessages"
                :key="item.id"
                class="chat-bubble"
                :class="{ 'chat-bubble--self': item.from === 'self' }"
              >
                <div>{{ item.content }}</div>
                <small class="muted">{{ item.time }}</small>
              </div>
            </div>

            <div class="inbox-chat-content__composer">
              <NSpace vertical :size="12">
                <NInput v-model:value="draftMessage" type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" />
                <NSpace>
                  <NButton type="primary">发送</NButton>
                  <NButton quaternary>上传图片</NButton>
                </NSpace>
              </NSpace>
            </div>
          </template>

          <div v-else class="inbox-chat-empty">
            <div class="inbox-chat-empty__inner">
              <div class="inbox-chat-empty__icon">···</div>
              <p class="inbox-chat-empty__title">暂未选中或发起聊天</p>
              <p class="inbox-chat-empty__text">快和朋友聊聊吧</p>
            </div>
          </div>
        </section>
      </div>
    </NCard>
  </NSpace>
</template>
