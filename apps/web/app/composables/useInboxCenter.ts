import { computed, watch } from "vue";
import {
  deleteChatMessages,
  deleteChatSessions,
  deleteGlobalNoticeForCurrentUser,
  deleteSiteMessage,
  getChatMessages,
  getChatSessions,
  getGlobalNotices,
  getSiteMessages,
  markChatMessagesRead,
  markGlobalNoticeRead,
  markSiteMessageRead,
} from "~/services/inbox";
import type {
  ChatMessageItem,
  ChatSessionItem,
  GlobalNoticeItem,
  SiteMessageItem,
} from "~/types/api";

export type InboxTab = "site" | "global" | "chat";
export type SiteMessageGroup = 1 | 2 | 3;

export function useInboxCenter() {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  const chatStore = useChatStore();
  const { socketStatus, socketError, connect, sendMessage, consumeIncomingMessages, inbox } = useChatSocket();

  const activeTab = shallowRef<InboxTab>("site");
  const activeSiteGroup = shallowRef<SiteMessageGroup>(1);
  const siteMessages = ref<SiteMessageItem[]>([]);
  const globalNotices = ref<GlobalNoticeItem[]>([]);
  const chatSessions = ref<ChatSessionItem[]>([]);
  const chatMessages = ref<ChatMessageItem[]>([]);
  const chatKeyword = shallowRef("");
  const chatDraft = shallowRef("");

  const sitePending = shallowRef(false);
  const globalPending = shallowRef(false);
  const sessionPending = shallowRef(false);
  const messagePending = shallowRef(false);

  const activeSession = computed(
    () => chatSessions.value.find((item) => item.session_id === chatStore.activeSessionId) ?? null,
  );

  const filteredChatSessions = computed(() => {
    const keyword = chatKeyword.value.trim().toLowerCase();
    if (!keyword) {
      return chatSessions.value;
    }

    return chatSessions.value.filter((item) => {
      const haystack = `${item.receiver_nickname} ${item.last_msg_content}`.toLowerCase();
      return haystack.includes(keyword);
    });
  });

  const siteCategories = computed(() => [
    {
      key: 1 as const,
      label: "评论与回复",
      hint: "评论文章、回复与楼层互动",
      count: messageStore.summary.comment_msg_count,
    },
    {
      key: 2 as const,
      label: "点赞与收藏",
      hint: "点赞、取消点赞、收藏与取消收藏",
      count: messageStore.summary.digg_favor_msg_count,
    },
    {
      key: 3 as const,
      label: "系统通知",
      hint: "审核通知、系统提醒与公告",
      count: messageStore.summary.system_msg_count,
    },
  ]);

  async function loadSiteMessages() {
    sitePending.value = true;
    try {
      const payload = await getSiteMessages({ group: activeSiteGroup.value, page: 1, limit: 30 });
      siteMessages.value = payload.list;
      return payload.list;
    } finally {
      sitePending.value = false;
    }
  }

  async function loadGlobalNotices() {
    globalPending.value = true;
    try {
      const payload = await getGlobalNotices({ page: 1, limit: 30, type: 1 });
      globalNotices.value = payload.list;
      return payload.list;
    } finally {
      globalPending.value = false;
    }
  }

  async function loadChatSessions() {
    sessionPending.value = true;
    try {
      const payload = await getChatSessions({ type: 1 });
      chatSessions.value = payload.list;
      if (!chatStore.activeSessionId && payload.list.length) {
        chatStore.setActiveSession(payload.list[0]?.session_id ?? null);
      }
      return payload.list;
    } finally {
      sessionPending.value = false;
    }
  }

  async function loadChatMessages(sessionId = chatStore.activeSessionId) {
    if (!sessionId) {
      chatMessages.value = [];
      return [];
    }

    messagePending.value = true;
    try {
      const payload = await getChatMessages({ sessionId, type: 1 });
      chatMessages.value = payload.list;
      const unreadIds = payload.list.filter((item) => !item.is_read && !item.is_self).map((item) => item.id);
      if (unreadIds.length) {
        await markChatMessagesRead(unreadIds).catch(() => undefined);
        await messageStore.refreshSummary().catch(() => undefined);
      }
      return payload.list;
    } finally {
      messagePending.value = false;
    }
  }

  async function markCurrentSiteGroupRead() {
    await markSiteMessageRead({ group: activeSiteGroup.value });
    await Promise.all([messageStore.refreshSummary(), loadSiteMessages()]);
  }

  async function removeSiteMessage(payload: { id?: string; group?: SiteMessageGroup }) {
    await deleteSiteMessage(payload);
    await Promise.all([messageStore.refreshSummary(), loadSiteMessages()]);
  }

  async function markAllGlobalRead() {
    const unreadIds = globalNotices.value.filter((item) => !item.is_read).map((item) => item.id);
    if (!unreadIds.length) return;
    await markGlobalNoticeRead(unreadIds);
    await Promise.all([messageStore.refreshSummary(), loadGlobalNotices()]);
  }

  async function removeGlobalNotice(id: string) {
    await deleteGlobalNoticeForCurrentUser([id]);
    await Promise.all([messageStore.refreshSummary(), loadGlobalNotices()]);
  }

  async function removeChatSession(sessionId: string) {
    await deleteChatSessions([sessionId]);
    await Promise.all([messageStore.refreshSummary(), loadChatSessions()]);
    if (chatStore.activeSessionId === sessionId) {
      chatStore.setActiveSession(chatSessions.value[0]?.session_id ?? null);
    }
  }

  async function removeChatMessage(id: string) {
    await deleteChatMessages([id]);
    await Promise.all([messageStore.refreshSummary(), loadChatMessages()]);
  }

  async function sendCurrentChatMessage() {
    const content = chatDraft.value.trim();
    const currentSession = activeSession.value;
    if (!content || !currentSession) {
      return false;
    }

    const optimisticMessage: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      sender_id: String(authStore.profileId ?? ""),
      receiver_id: currentSession.receiver_id,
      session_id: currentSession.session_id,
      content,
      send_time: new Date().toISOString(),
      msg_status: 1,
      msg_type: 1,
      is_self: true,
      is_read: false,
    };

    chatMessages.value = [...chatMessages.value, optimisticMessage];
    chatDraft.value = "";

    try {
      await sendMessage({
        receiver_id: currentSession.receiver_id,
        msg_type: 1,
        content,
      });
      await Promise.all([loadChatMessages(currentSession.session_id), loadChatSessions()]);
      return true;
    } catch (error) {
      chatDraft.value = content;
      chatMessages.value = chatMessages.value.filter((item) => item.id !== optimisticMessage.id);
      throw error;
    }
  }

  watch(
    () => activeSiteGroup.value,
    async () => {
      if (activeTab.value === "site") {
        await loadSiteMessages();
      }
    },
  );

  watch(
    () => activeTab.value,
    async (tab) => {
      if (tab === "site") {
        await loadSiteMessages();
        return;
      }

      if (tab === "global") {
        await loadGlobalNotices();
        return;
      }

      await connect();
      await Promise.all([loadChatSessions(), loadChatMessages()]);
    },
    { immediate: true },
  );

  watch(
    () => chatStore.activeSessionId,
    async (sessionId) => {
      if (activeTab.value === "chat" && sessionId) {
        await loadChatMessages(sessionId);
      }
    },
  );

  watch(
    () => inbox.value.length,
    async () => {
      const sessionId = activeSession.value?.session_id;
      if (!sessionId) return;
      const incoming = consumeIncomingMessages(sessionId);
      if (!incoming.length) return;
      await Promise.all([loadChatMessages(sessionId), loadChatSessions(), messageStore.refreshSummary()]);
    },
  );

  return {
    activeTab,
    activeSiteGroup,
    activeSessionId: computed({
      get: () => chatStore.activeSessionId,
      set: (value) => chatStore.setActiveSession(value),
    }),
    activeSession,
    siteCategories,
    siteMessages,
    globalNotices,
    chatSessions,
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
    loadChatSessions,
    loadChatMessages,
    markCurrentSiteGroupRead,
    removeSiteMessage,
    markAllGlobalRead,
    removeGlobalNotice,
    removeChatSession,
    removeChatMessage,
    sendCurrentChatMessage,
    connectSocket: connect,
  };
}
