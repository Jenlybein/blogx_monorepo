export type ThemeMode = "light" | "dark";

export interface ApiEnvelope<T> {
  code: number;
  msg: string;
  data: T;
}

export interface ApiEmptyObject {
  [key: string]: never;
}

export interface SiteSeoData {
  site_title: string;
  project_title: string;
  logo: string;
  icon: string;
  keywords: string;
  description: string;
}

export interface SiteRuntimeConfig {
  site_info: {
    title?: string;
    subtitle?: string;
    mode?: number;
  };
  project: {
    title?: string;
    abstract?: string;
  };
  login: {
    qq?: boolean;
    email?: boolean;
    pwd?: boolean;
  };
  index_right: {
    list?: Array<{
      title: string;
      abstract?: string;
    }>;
  };
  article: {
    show_author?: boolean;
  };
  comment: {
    toggle?: boolean;
  };
}

export interface SiteAiInfo {
  enable: boolean;
  nickname: string;
  avatar: string;
  abstract: string;
}

export interface BannerItem {
  id: string;
  cover: string;
  href: string;
  show: boolean;
}

export interface OptionItem {
  label: string;
  value: string;
}

export interface FavoriteFolderItem {
  id: string;
  user_id: string;
  title: string;
  cover: string;
  abstract: string;
  is_default: boolean;
  article_count: number;
  nickname?: string;
  avatar?: string;
  has_article: boolean;
}

export interface FavoriteFolderListData {
  list: FavoriteFolderItem[];
  count: number;
}

export interface FavoriteFolderCreatePayload {
  id: string;
  user_id: string;
  title: string;
  cover: string;
  abstract: string;
  is_default: boolean;
  article_count: number;
}

export interface SearchTag {
  id: string;
  title: string;
}

export interface SearchCategory {
  id: string;
  title: string;
}

export interface SearchAuthor {
  id: string;
  nickname: string;
  avatar: string;
}

export interface SearchPagination {
  mode: "has_more" | "count";
  page: number;
  limit: number;
  has_more: boolean;
  total?: number;
  total_pages?: number;
}

export interface SearchArticleItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  abstract?: string;
  cover: string;
  view_count: number;
  digg_count: number;
  comment_count: number;
  favor_count: number;
  comments_toggle: boolean;
  status: number;
  tags: SearchTag[];
  category?: SearchCategory;
  author: SearchAuthor;
  highlight?: {
    title?: string;
    abstract?: string;
  };
}

export interface SearchArticleResponse {
  list: SearchArticleItem[];
  pagination: SearchPagination;
}

export interface ArticleTopItem {
  id: string;
  title: string;
  abstract: string;
  cover: string;
  view_count: number;
  digg_count: number;
  comment_count: number;
  favor_count: number;
  tags: string[];
  user_nickname: string;
  user_avatar: string;
  category_title: string;
}

export interface ArticleDetail {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  abstract: string;
  content: string;
  cover: string;
  view_count: number;
  digg_count: number;
  comment_count: number;
  favor_count: number;
  comments_toggle: boolean;
  status: number;
  tags: string[];
  author_id: string;
  author_avatar: string;
  author_abstract: string;
  author_created_time: string;
  author_name: string;
  author_username: string;
  category_name: string;
  is_digg: boolean;
  is_favor: boolean;
}

export interface CommentRootItem {
  id: string;
  created_at: string;
  content: string;
  user_id: string;
  reply_id: string;
  root_id: string;
  digg_count: number;
  reply_count: number;
  is_digg: boolean;
  relation: number;
  status: number;
  user_nickname: string;
  user_avatar: string;
}

export interface CommentRootListData {
  list: CommentRootItem[];
  count?: number;
  has_more: boolean;
}

export interface CommentReplyItem {
  created_at: string;
  content: string;
  user_id: string;
  reply_id: string;
  digg_count: number;
  reply_count: number;
  is_digg: boolean;
  relation: number;
  status: number;
  user_nickname: string;
  user_avatar: string;
  reply_user_nickname: string;
}

export interface CommentReplyListData {
  root_id: string;
  reply_count: number;
  list: CommentReplyItem[];
  count?: number;
  has_more: boolean;
}

export interface UserBaseInfo {
  id: string;
  code_age: number;
  avatar: string;
  nickname: string;
  abstract?: string;
  view_count: number;
  fans_count: number;
  follow_count: number;
  article_visited_count: number;
  article_count: number;
  favor_count?: number;
  digg_count?: number;
  comment_count?: number;
  favorites_visibility: boolean;
  followers_visibility: boolean;
  fans_visibility: boolean;
  home_style_id: string | null;
  relation: number;
  place: string;
}

export interface ArticleAuthorInfo {
  author_id: string;
  article_count: number;
  article_visited_count: number;
  fans_count: number;
}

export interface UserSelfDetail {
  id: string;
  created_at: string;
  username: string;
  nickname: string;
  avatar: string;
  abstract: string;
  register_source: number;
  code_age: number;
  favorites_visibility?: boolean;
  followers_visibility?: boolean;
  fans_visibility?: boolean;
  home_style_id?: string | null;
  like_tags?: string | null;
  updated_username_date?: string | null;
}

export interface EmailVerifyPayload {
  email_id: string;
  email: string;
}
