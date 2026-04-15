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
const MESSAGE_PAGE_SIZE = 9;

export function useInboxCenter() {
  const authStore = useAuthStore();
  const messageStore = useMessageStore();
  const chatStore = useChatStore();
  const { socketStatus, socketError, connect, sendMessage, consumeIncomingMessages, inbox } = useChatSocket();

  const activeTab = shallowRef<InboxTab>("site");
  const activeSiteGroup = shallowRef<SiteMessageGroup>(1);
  const sitePage = shallowRef(1);
  const globalPage = shallowRef(1);
  const siteHasMore = shallowRef(false);
  const globalHasMore = shallowRef(false);
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
      hint: "",
      count: messageStore.summary.comment_msg_count,
    },
    {
      key: 2 as const,
      label: "点赞与收藏",
      hint: "",
      count: messageStore.summary.digg_favor_msg_count,
    },
    {
      key: 3 as const,
      label: "系统通知",
      hint: "",
      count: messageStore.summary.system_msg_count,
    },
  ]);

  async function loadSiteMessages(page = sitePage.value, options: { append?: boolean } = {}) {
    sitePending.value = true;
    try {
      const payload = await getSiteMessages({ group: activeSiteGroup.value, page, limit: MESSAGE_PAGE_SIZE });
      sitePage.value = page;
      siteHasMore.value = payload.has_more;
      siteMessages.value = options.append ? [...siteMessages.value, ...payload.list] : payload.list;
      return payload.list;
    } finally {
      sitePending.value = false;
    }
  }

  async function loadGlobalNotices(page = globalPage.value, options: { append?: boolean } = {}) {
    globalPending.value = true;
    try {
      const payload = await getGlobalNotices({ page, limit: MESSAGE_PAGE_SIZE, type: 1 });
      globalPage.value = page;
      globalHasMore.value = payload.has_more;
      globalNotices.value = options.append ? [...globalNotices.value, ...payload.list] : payload.list;
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
    sitePage.value = 1;
    await Promise.all([messageStore.refreshSummary(), loadSiteMessages(1)]);
  }

  async function removeSiteMessage(payload: { id?: string; group?: SiteMessageGroup }) {
    await deleteSiteMessage(payload);
    sitePage.value = 1;
    await Promise.all([messageStore.refreshSummary(), loadSiteMessages(1)]);
  }

  async function markAllGlobalRead() {
    const unreadIds = globalNotices.value.filter((item) => !item.is_read).map((item) => item.id);
    if (!unreadIds.length) return;
    await markGlobalNoticeRead(unreadIds);
    globalPage.value = 1;
    await Promise.all([messageStore.refreshSummary(), loadGlobalNotices(1)]);
  }

  async function removeGlobalNotice(id: string) {
    await deleteGlobalNoticeForCurrentUser([id]);
    globalPage.value = 1;
    await Promise.all([messageStore.refreshSummary(), loadGlobalNotices(1)]);
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
        sitePage.value = 1;
        await loadSiteMessages(1);
      }
    },
  );

  watch(
    () => activeTab.value,
    async (tab) => {
      if (tab === "site") {
        sitePage.value = 1;
        await loadSiteMessages(1);
        return;
      }

      if (tab === "global") {
        globalPage.value = 1;
        await loadGlobalNotices(1);
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

  async function loadMoreSiteMessages() {
    if (sitePending.value || !siteHasMore.value) {
      return [];
    }
    return loadSiteMessages(sitePage.value + 1, { append: true });
  }

  async function loadMoreGlobalNotices() {
    if (globalPending.value || !globalHasMore.value) {
      return [];
    }
    return loadGlobalNotices(globalPage.value + 1, { append: true });
  }

  return {
    activeTab,
    activeSiteGroup,
    activeSessionId: computed({
      get: () => chatStore.activeSessionId,
      set: (value) => chatStore.setActiveSession(value),
    }),
    activeSession,
    siteCategories,
    sitePage,
    siteHasMore,
    globalPage,
    globalHasMore,
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
    loadMoreSiteMessages,
    loadMoreGlobalNotices,
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
