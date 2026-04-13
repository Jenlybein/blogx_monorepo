<script setup lang="ts">
import { useMessage } from "naive-ui";
import InboxChatPanel from "~/components/inbox/InboxChatPanel.vue";
import InboxGlobalPanel from "~/components/inbox/InboxGlobalPanel.vue";
import InboxSitePanel from "~/components/inbox/InboxSitePanel.vue";

definePageMeta({
  layout: "studio",
  middleware: "auth",
});

const message = useMessage();
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
  markCurrentSiteGroupRead,
  removeSiteMessage,
  markAllGlobalRead,
  removeGlobalNotice,
  removeChatSession,
  removeChatMessage,
  sendCurrentChatMessage,
  connectSocket,
} = inbox;

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
    <StudioPageHeader
      title="消息中心"
      description="Phase4 先把站内消息、全局通知、私信会话与 WebSocket 接入落成正式页面。对于后端尚未文档化的协议细节，前端只做兼容实现，不假定不存在的行为。"
      eyebrow="Inbox"
    >
      <div class="studio-filter-row">
        <button type="button" class="studio-filter-chip" :class="{ 'is-active': activeTab === 'site' }" @click="activeTab = 'site'">
          站内消息
        </button>
        <button type="button" class="studio-filter-chip" :class="{ 'is-active': activeTab === 'global' }" @click="activeTab = 'global'">
          全局通知
        </button>
        <button type="button" class="studio-filter-chip" :class="{ 'is-active': activeTab === 'chat' }" @click="activeTab = 'chat'">
          私信
        </button>
      </div>
    </StudioPageHeader>

    <InboxSitePanel
      v-if="activeTab === 'site'"
      :categories="siteCategories"
      :active-group="activeSiteGroup"
      :items="siteMessages"
      :pending="sitePending"
      @update:active-group="activeSiteGroup = $event"
      @mark-all-read="markCurrentSiteGroupRead()"
      @remove="removeSiteMessage({ id: $event })"
      @clear-group="removeSiteMessage({ group: activeSiteGroup })"
    />

    <InboxGlobalPanel
      v-else-if="activeTab === 'global'"
      :items="globalNotices"
      :pending="globalPending"
      @mark-all-read="markAllGlobalRead()"
      @remove="removeGlobalNotice($event)"
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
