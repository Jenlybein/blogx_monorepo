export type NavItem = { label: string; to: string };
export type NavGroup = { title: string; items: NavItem[] };
export type PublicUser = {
  avatarText: string;
  nickname: string;
};

export const publicNav: NavItem[] = [
  { label: "首页", to: "/" },
  { label: "课程", to: "/courses" },
];

export const mockPublicUser: PublicUser = {
  avatarText: "RV",
  nickname: "River",
};

export const studioNav: NavGroup[] = [
  {
    title: "工作台",
    items: [
      { label: "数据概览", to: "/studio/dashboard" },
      { label: "我的文章", to: "/studio/profile" },
      { label: "浏览历史", to: "/studio/history" },
      { label: "最近登录", to: "/studio/recent-logins" },
      { label: "消息中心", to: "/studio/inbox" },
      { label: "账户设置", to: "/studio/settings" },
    ],
  },
];

export const adminNav: NavGroup[] = [
  {
    title: "运营后台",
    items: [
      { label: "仪表盘", to: "/" },
      { label: "文章审核", to: "/review" },
      { label: "用户管理", to: "/users" },
      { label: "站点配置", to: "/site" },
      { label: "日志中心", to: "/logs" },
      { label: "媒体与轮播", to: "/media" },
    ],
  },
];

export const growthSeries = {
  dates: ["04-01", "04-02", "04-03", "04-04", "04-05", "04-06", "04-07"],
  articles: [22, 25, 31, 28, 35, 41, 45],
  users: [6, 8, 9, 12, 11, 13, 16],
};

export const articleYearSeries = {
  months: ["1月", "2月", "3月", "4月", "5月", "6月"],
  values: [42, 51, 66, 78, 74, 93],
};
