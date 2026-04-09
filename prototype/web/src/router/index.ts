import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/public/HomeView.vue"),
    meta: {
      hidePageHeader: true,
      shell: "public",
      title: "开发者首页",
      subtitle: "面向社区模式的内容门户：首页需要同时承担品牌、推荐、搜索入口与作者曝光。",
    },
  },
  {
    path: "/articles",
    redirect: "/search",
  },
  {
    path: "/article/demo",
    component: () => import("@/views/public/ArticleDetailView.vue"),
    meta: {
      shell: "public",
      title: "文章详情",
      subtitle: "详情页是阅读主链路，需要同时容纳文章、作者、目录、交互区和评论区。",
    },
  },
  {
    path: "/search",
    component: () => import("@/views/public/SearchView.vue"),
    meta: {
      shell: "public",
      title: "搜索中心",
      subtitle: "公开搜索页既要容纳关键词检索，也要为 AI 搜索结果保留结构入口。",
    },
  },
  {
    path: "/users/:id",
    component: () => import("@/views/public/ProfileHomeView.vue"),
    meta: {
      shell: "public",
      title: "个人首页",
      subtitle: "公开态作者主页承担内容展示、社交关系和个人成就曝光，是文章详情之外最重要的作者入口。",
    },
  },
  {
    path: "/studio/dashboard",
    component: () => import("@/views/studio/DashboardView.vue"),
    meta: {
      shell: "studio",
      title: "数据概览",
      subtitle: "围绕账号、文章、互动、收藏与消息的个人中心总览，贴近 users/detail、sitemsg/user、comments/man、articles/history 等用户侧数据。",
      breadcrumb: "Studio / Data Overview",
    },
  },
  {
    path: "/studio/profile",
    component: () => import("@/views/studio/EditorView.vue"),
    meta: {
      shell: "studio",
      title: "个人中心",
      subtitle: "围绕作者本人展开：展示账号信息、创作状态和全部文章，而不是把写作器塞进工作台里。",
      breadcrumb: "Studio / Profile",
    },
  },
  {
    path: "/studio/history",
    component: () => import("@/views/studio/HistoryView.vue"),
    meta: {
      shell: "studio",
      title: "浏览历史",
      subtitle: "集中查看最近读过的文章、来源入口与再次阅读状态，作为个人中心里的独立内容回访入口。",
      breadcrumb: "Studio / History",
    },
  },
  {
    path: "/studio/recent-logins",
    component: () => import("@/views/studio/RecentLoginsView.vue"),
    meta: {
      shell: "studio",
      title: "最近登录",
      subtitle: "集中查看最近登录设备、地点和时间，作为个人中心里的独立安全入口。",
      breadcrumb: "Studio / Recent Logins",
    },
  },
  {
    path: "/studio/editor",
    redirect: "/studio/profile",
  },
  {
    path: "/studio/write",
    component: () => import("@/views/studio/WriteArticleView.vue"),
    meta: {
      shell: "write",
      title: "创作文章",
      subtitle: "独立写作页面以沉浸式编辑为主，不复用个人中心的侧栏结构。",
    },
  },
  {
    path: "/studio/inbox",
    component: () => import("@/views/studio/InboxView.vue"),
    meta: {
      shell: "studio",
      title: "消息中心",
      subtitle: "站内消息、全局通知、私信会话合并在一个入口，但视图仍然分域展示。",
      breadcrumb: "Studio / Inbox",
    },
  },
  {
    path: "/studio/settings",
    component: () => import("@/views/studio/SettingsView.vue"),
    meta: {
      shell: "studio",
      title: "账户设置",
      subtitle: "设置页按资料、安全、消息偏好三段拆分，避免长表单造成认知负担。",
      breadcrumb: "Studio / Settings",
    },
  },
];
