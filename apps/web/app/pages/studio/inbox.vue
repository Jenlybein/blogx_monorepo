<script setup lang="ts">
import { useMessage } from "naive-ui";
import InboxChatPanel from "~/components/inbox/InboxChatPanel.vue";
import InboxSitePanel from "~/components/inbox/InboxSitePanel.vue";
import type { SiteMessageItem } from "~/types/api";
import type { SiteMessageGroup } from "~/composables/useInboxCenter";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
const route = useRoute();
const router = useRouter();
const inbox = useInboxCenter();
const {
  activeTab,
  activeSiteGroup,
  activeSessionId,
  activeSession,
  siteCategories,
  siteMessages,
  globalNotices,
  filteredChatSessions,
  chatMessages,
  chatKeyword,
  chatDraft,
  sitePending,
  globalPending,
  sessionPending,
  messagePending,
  socketStatus,
  socketError,
  loadSiteMessages,
  loadGlobalNotices,
  markCurrentSiteGroupRead,
  removeSiteMessage,
  markAllGlobalRead,
  removeGlobalNotice,
  removeChatSession,
  removeChatMessage,
  sendCurrentChatMessage,
  connectSocket,
} = inbox;

type InboxTab = "site" | "chat";
type InboxMessageGroup = SiteMessageGroup | "global";

function resolveInboxTab(value: unknown): InboxTab {
  return value === "chat" ? "chat" : "site";
}

watch(
  () => route.query.tab,
  (value) => {
    activeTab.value = resolveInboxTab(value);
  },
  { immediate: true },
);

watch(
  () => activeTab.value,
  (value) => {
    const next = resolveInboxTab(route.query.tab);
    if (next === value) return;
    void router.replace({
      query: {
        ...route.query,
        tab: value,
      },
    });
  },
);

const activeMessageGroup = shallowRef<InboxMessageGroup>(1);

function resolveMessageGroup(value: unknown): InboxMessageGroup {
  return value === "global" ? "global" : [1, 2, 3].includes(Number(value)) ? (Number(value) as SiteMessageGroup) : 1;
}

watch(
  () => route.query.group,
  (value) => {
    activeMessageGroup.value = resolveMessageGroup(value);
  },
  { immediate: true },
);

watch(
  () => activeMessageGroup.value,
  (value) => {
    if (value !== "global") {
      activeSiteGroup.value = value;
    }
    const nextGroup = resolveMessageGroup(route.query.group);
    if (nextGroup === value) return;
    void router.replace({
      query: {
        ...route.query,
        group: value === 1 ? undefined : String(value),
      },
    });
  },
);

watch(
  () => activeMessageGroup.value,
  async (value) => {
    if (activeTab.value === "chat") return;
    if (value === "global") {
      await loadGlobalNotices();
      return;
    }
    activeSiteGroup.value = value;
    await loadSiteMessages();
  },
  { immediate: true },
);

const mergedCategories = computed(() => [
  ...siteCategories.value,
  {
    key: "global" as const,
    label: "全局通知",
    hint: "站点公告与平台级通知",
    count: globalNotices.value.filter((item) => !item.is_read).length,
  },
]);

const mergedItems = computed<SiteMessageItem[]>(() => {
  if (activeMessageGroup.value !== "global") {
    return siteMessages.value;
  }
  return globalNotices.value.map((item) => ({
    id: item.id,
    created_at: item.create_at,
    updated_at: item.create_at,
    type: 9,
    receiver_id: "",
    action_user_id: null,
    action_user_nickname: "系统",
    action_user_avatar: null,
    content: item.content,
    article_id: "",
    comment_id: "",
    article_title: item.title,
    link_title: item.title,
    link_herf: item.herf,
    is_read: item.is_read,
    read_at: null,
  }));
});

const mergedPending = computed(() => (activeMessageGroup.value === "global" ? globalPending.value : sitePending.value));

async function handleMarkAllRead() {
  if (activeMessageGroup.value === "global") {
    await markAllGlobalRead();
    return;
  }
  await markCurrentSiteGroupRead();
}

async function handleRemoveMessage(id: string) {
  if (activeMessageGroup.value === "global") {
    await removeGlobalNotice(id);
    return;
  }
  await removeSiteMessage({ id });
}

async function handleClearGroup() {
  if (activeMessageGroup.value === "global") {
    const unreadIds = globalNotices.value.filter((item) => !item.is_read).map((item) => item.id);
    if (unreadIds.length) {
      await markAllGlobalRead();
    }
    return;
  }
  await removeSiteMessage({ group: activeSiteGroup.value });
}

async function handleSend() {
  try {
    await sendCurrentChatMessage();
    message.success("消息已发送");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "发送消息失败");
  }
}

async function handleReconnect() {
  await connectSocket();
}

useSeoMeta({
  title: "个人中心 - 消息中心",
});
</script>

<template>
  <div class="page-stack">
    <InboxSitePanel
      v-if="activeTab === 'site'"
      :categories="mergedCategories"
      :active-group="activeMessageGroup"
      :items="mergedItems"
      :pending="mergedPending"
      @update:active-group="activeMessageGroup = $event"
      @mark-all-read="handleMarkAllRead()"
      @remove="handleRemoveMessage($event)"
      @clear-group="handleClearGroup()"
    />

    <InboxChatPanel
      v-else
      :sessions="filteredChatSessions"
      :active-session-id="activeSessionId ?? null"
      :current-session="activeSession"
      :items="chatMessages"
      :keyword="chatKeyword"
      :draft="chatDraft"
      :session-pending="sessionPending"
      :message-pending="messagePending"
      :socket-status="socketStatus"
      :socket-error="socketError"
      @update:active-session-id="activeSessionId = $event"
      @update:keyword="chatKeyword = $event"
      @update:draft="chatDraft = $event"
      @send="handleSend()"
      @remove-session="removeChatSession($event)"
      @remove-message="removeChatMessage($event)"
      @reconnect="handleReconnect()"
    />

    <div class="surface-section p-4 text-sm leading-7 muted">
      当前实现说明：
      私信页已经接入 `ws-ticket` 与 `ws` 建连，并按后端源码兼容了文本消息发送协议 `receiver_id + msg_type + content`。
      但发送成功回执、图片/Markdown 富消息体验、离线补偿等高级能力，仍取决于后端后续联调。
    </div>
  </div>
</template>
