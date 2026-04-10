import type { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: {
      shell: "auth",
      title: "后台登录",
      subtitle: "后台登录页用于承接管理员身份验证、环境提示与安全说明。",
      breadcrumb: "Admin / Login",
    },
  },
  {
    path: "/",
    component: () => import("@/views/admin/DashboardView.vue"),
    meta: {
      shell: "admin",
      title: "后台仪表盘",
      subtitle: "后台首页先回答“站点当前状态如何、有哪些待处理问题”，再展开明细模块。",
      breadcrumb: "Admin / Dashboard",
    },
  },
  {
    path: "/review",
    component: () => import("@/views/admin/ReviewView.vue"),
    meta: {
      shell: "admin",
      title: "文章审核",
      subtitle: "审核台重点验证筛选栏、结果表格、详情抽屉替身和处理动作区。",
      breadcrumb: "Admin / Review",
    },
  },
  {
    path: "/users",
    component: () => import("@/views/admin/UsersView.vue"),
    meta: {
      shell: "admin",
      title: "用户管理",
      subtitle: "用户管理页验证列表、筛选、状态标签与详情编辑侧板的结构关系。",
      breadcrumb: "Admin / Users",
    },
  },
  {
    path: "/site",
    component: () => import("@/views/admin/SiteView.vue"),
    meta: {
      shell: "admin",
      title: "站点配置",
      subtitle: "站点配置页需要体现基础配置与 AI 配置两套模型。",
      breadcrumb: "Admin / Site",
    },
  },
  {
    path: "/logs",
    component: () => import("@/views/admin/LogsView.vue"),
    meta: {
      shell: "admin",
      title: "日志中心",
      subtitle: "日志页需要突出筛选能力、列表信息密度和详情展开后的上下文字段。",
      breadcrumb: "Admin / Logs",
    },
  },
  {
    path: "/media",
    component: () => import("@/views/admin/MediaView.vue"),
    meta: {
      shell: "admin",
      title: "媒体与轮播",
      subtitle: "媒体页需要同时容纳上传任务状态、资源库和轮播运营视图。",
      breadcrumb: "Admin / Media",
    },
  },
];
