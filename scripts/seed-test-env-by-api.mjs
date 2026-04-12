import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const cwd = process.cwd();
const envrcPath = path.join(cwd, ".envrc");

function parseEnvrc(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.startsWith("export ")) continue;
    const body = trimmed.slice("export ".length);
    const eqIndex = body.indexOf("=");
    if (eqIndex < 0) continue;
    const key = body.slice(0, eqIndex).trim();
    let value = body.slice(eqIndex + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    value = value.replace(/\$([A-Z0-9_]+)/gi, (_, name) => env[name] ?? process.env[name] ?? "");
    env[key] = value;
  }
  return env;
}

const envrc = parseEnvrc(envrcPath);

function getEnv(name, fallback = "") {
  return process.env[name] ?? envrc[name] ?? fallback;
}

const config = {
  baseUrl: getEnv("BLOGX_SEED_BASE_URL", "http://106.53.184.85"),
  adminLogin: getEnv("BLOGX_SEED_ADMIN_LOGIN", "testAdmin"),
  adminPassword: getEnv("BLOGX_SEED_ADMIN_PASSWORD", "123456123"),
  imageDomain: getEnv("BLOGX_QINIU_DOMAIN", "https://image.gentlybeing.cn"),
  siteHost: getEnv("BLOGX_WEB_SITE_HOST", "http://gentlybeing.cn"),
  dbHost: getEnv("BLOGX_DB_MASTER_HOST", ""),
  dbPort: getEnv("BLOGX_DB_MASTER_PORT", "3306"),
  dbUser: getEnv("BLOGX_DB_USER", ""),
  dbPassword: getEnv("BLOGX_DB_PASSWORD", ""),
  dbName: getEnv("BLOGX_DB_NAME", ""),
};

function normalizeBaseUrl(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const baseUrl = normalizeBaseUrl(config.baseUrl);

class ApiError extends Error {
  constructor(message, payload) {
    super(message);
    this.name = "ApiError";
    this.payload = payload;
  }
}

async function request(pathname, { method = "GET", token, body, query } = {}) {
  const url = new URL(`${baseUrl}${pathname}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      if (Array.isArray(value)) {
        for (const item of value) url.searchParams.append(key, String(item));
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  const headers = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(`响应不是 JSON: ${pathname}`, { status: response.status, text });
  }

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status}: ${pathname}`, payload);
  }
  if (payload.code !== 0) {
    throw new ApiError(payload.msg || `业务失败: ${pathname}`, payload);
  }
  return payload.data;
}

function logStep(title) {
  console.log(`\n== ${title} ==`);
}

function ensureListShape(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.list)) return data.list;
  return [];
}

function normalizeOptionList(list) {
  return ensureListShape(list).map((item) => ({
    id: String(item.id ?? item.value),
    title: item.title ?? item.label,
  }));
}

function toJsonIdLiteral(value) {
  if (value === null || value === undefined || value === "") return "null";
  const text = String(value);
  if (!/^\d+$/.test(text)) {
    throw new Error(`非法数字 ID: ${text}`);
  }
  return JSON.stringify(text);
}

function buildArticleBody(article, categoryId, tagIds) {
  return `{
    "title": ${JSON.stringify(article.title)},
    "abstract": ${JSON.stringify(article.abstract)},
    "content": ${JSON.stringify(article.content)},
    "category_id": ${toJsonIdLiteral(categoryId)},
    "tag_ids": [${tagIds.map((id) => toJsonIdLiteral(id)).join(",")}],
    "cover": ${JSON.stringify(article.cover)},
    "comments_toggle": true,
    "status": 2
  }`;
}

function buildArticleUpdateBody(article, categoryId, tagIds) {
  return `{
    "abstract": ${JSON.stringify(article.abstract)},
    "content": ${JSON.stringify(article.content)},
    "category_id": ${toJsonIdLiteral(categoryId)},
    "tag_ids": [${tagIds.map((id) => toJsonIdLiteral(id)).join(",")}],
    "cover": ${JSON.stringify(article.cover)},
    "comments_toggle": true
  }`;
}

function queryMysql(sql) {
  if (!config.dbHost || !config.dbUser || !config.dbPassword || !config.dbName) {
    throw new Error("缺少数据库只读回查所需连接信息");
  }
  const output = execFileSync(
    "mysql",
    [
      "-h",
      config.dbHost,
      "-P",
      config.dbPort,
      "-u",
      config.dbUser,
      `-p${config.dbPassword}`,
      "-D",
      config.dbName,
      "--batch",
      "--skip-column-names",
      "-e",
      sql,
    ],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  return output
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split("\t"));
}

const siteRuntimePayload = {
  site_info: {
    title: "BlogX",
    logo: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
    beian: "粤ICP备2026000001号-1",
    mode: 1,
  },
  project: {
    title: "BlogX",
    icon: "/favicon.ico",
    web_path: config.siteHost,
  },
  seo: {
    keywords: "Nuxt, Vue3, OpenAPI, 前端架构, 开发者博客",
    description: "BlogX 是一个面向开发者的内容平台，用来沉淀前端架构、工程化和产品实现经验。",
  },
  about: {
    version: "0.1.0-test",
    site_date: "2026-04-13",
    qq: "865033582",
    wechat: "blogx-dev",
    gitee: "https://gitee.com/gentlybeing/blogx",
    bilibili: "https://space.bilibili.com/1",
    github: "https://github.com/gentlybeing/blogx",
  },
  login: {
    qq_login: false,
    username_pwd_login: true,
    email_login: true,
    captcha: false,
    email_code_timeout: 5,
    login_fail_window_minute: 15,
    login_fail_user_max: 5,
    login_fail_ip_max: 20,
    email_send_window_second: 60,
    email_send_per_email_max: 1,
    email_send_per_ip_max: 10,
  },
  index_right: {
    list: [
      { title: "site_notice", enable: true },
      { title: "hot_tags", enable: true },
      { title: "recommended_authors", enable: true },
    ],
  },
  article: {
    skip_examining: true,
  },
  comment: {
    skip_examining: true,
  },
};

const categoryTitles = ["前端架构", "工程化", "接口设计", "性能优化"];

const tagDefinitions = [
  { title: "Nuxt", sort: 10, description: "Nuxt 相关内容", is_enabled: true },
  { title: "Vue3", sort: 20, description: "Vue 3 相关内容", is_enabled: true },
  { title: "OpenAPI", sort: 30, description: "OpenAPI 规范与接口联调", is_enabled: true },
  { title: "Monorepo", sort: 40, description: "Monorepo 工程实践", is_enabled: true },
  { title: "SSR", sort: 50, description: "服务端渲染", is_enabled: true },
  { title: "搜索", sort: 60, description: "站内搜索与推荐", is_enabled: true },
];

const articleDefinitions = [
  {
    title: "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程",
    abstract: "从站点信息、搜索、文章详情到个人主页，梳理如何围绕已存在接口能力搭建 Nuxt 4 web 端。",
    content: [
      "# 基于 OpenAPI 反向设计 Nuxt Web 前端",
      "",
      "这一篇用于测试环境联调，覆盖首页、搜索页、文章详情和作者主页需要的核心字段。",
      "",
      "## 核心原则",
      "",
      "- service 只负责请求",
      "- composable 组织加载和错误状态",
      "- store 只放跨页面共享状态",
      "",
      "## 为什么先把站点 runtime 配起来",
      "",
      "因为首页、登录方式、SEO 和右侧栏都依赖运行时配置。",
    ].join("\n"),
    category: "前端架构",
    tags: ["Nuxt", "Vue3", "OpenAPI"],
    cover: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
    top: true,
  },
  {
    title: "搜索接口驱动的前端筛选设计",
    abstract: "围绕 key、sort、tag_ids 等真实接口参数，做一个可维护、可扩展的搜索页结构。",
    content: [
      "# 搜索接口驱动的前端筛选设计",
      "",
      "这篇文章用于联调搜索页与文章列表样式复用。",
      "",
      "## 查询参数",
      "",
      "- key",
      "- sort",
      "- tag_ids",
      "- category_id",
      "",
      "## 交互建议",
      "",
      "尽量把筛选栏压缩成一层，结果列表复用首页样式。",
    ].join("\n"),
    category: "接口设计",
    tags: ["OpenAPI", "搜索", "Nuxt"],
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
  },
  {
    title: "Monorepo 下的 Nuxt Web 端分层与可持续迭代",
    abstract: "从 layouts、middleware、service、composable、Pinia 到测试策略，给出一套长期可维护的结构。",
    content: [
      "# Monorepo 下的 Nuxt Web 端分层",
      "",
      "这篇文章用于联调个人主页、我的文章和首页列表。",
      "",
      "## 目录建议",
      "",
      "- app/components",
      "- app/composables",
      "- app/services",
      "- app/stores",
      "",
      "## 关键收益",
      "",
      "让公共主链路和个人中心能稳定并行迭代。",
    ].join("\n"),
    category: "工程化",
    tags: ["Monorepo", "Vue3", "SSR"],
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
  },
];

const bannerDefinitions = [
  {
    cover: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
    href: `${config.siteHost}/article/1`,
    show: true,
  },
  {
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
    href: `${config.siteHost}/search?key=Nuxt`,
    show: true,
  },
];

const globalNotifDefinitions = [
  {
    title: "测试环境内容已初始化",
    content: "用于联调 web 端首页、搜索、文章详情与个人中心的数据已经写入测试环境。",
    href: `${config.siteHost}/`,
    icon: "bullhorn",
    user_visible_rule: 1,
  },
];

async function loginAsAdmin() {
  const token = await request("/api/users/login", {
    method: "POST",
    body: {
      username: config.adminLogin,
      password: config.adminPassword,
    },
  });
  return token;
}

async function ensureSiteRuntime(token) {
  logStep("站点运行时配置");
  try {
    const current = await request("/api/site/site", { token, auth: false });
    if (current?.site_info?.title === siteRuntimePayload.site_info.title) {
      console.log("站点 runtime 已存在，执行更新以确保字段完整。");
    }
  } catch (error) {
    console.log(`读取站点 runtime 失败，改为直接写入：${error.message}`);
  }
  await request("/api/site/site", {
    method: "PUT",
    token,
    body: siteRuntimePayload,
  });
  console.log("站点 runtime 已更新。");
}

async function getCategoryOptions(token) {
  return normalizeOptionList(await request("/api/articles/category/options", { token }));
}

async function ensureCategories(token) {
  logStep("分类");
  let options = await getCategoryOptions(token);
  const byTitle = new Map(options.map((item) => [item.title, item]));
  for (const title of categoryTitles) {
    if (byTitle.has(title)) {
      console.log(`已存在分类：${title}`);
      continue;
    }
    await request("/api/articles/category", {
      method: "POST",
      token,
      body: { title },
    });
    console.log(`创建分类：${title}`);
  }
  options = await getCategoryOptions(token);
  return new Map(options.map((item) => [item.title, item]));
}

async function getTagOptions(token) {
  return normalizeOptionList(await request("/api/articles/tags/options", { token }));
}

async function ensureTags(token) {
  logStep("标签");
  let options = await getTagOptions(token);
  const byTitle = new Map(options.map((item) => [item.title, item]));
  for (const tag of tagDefinitions) {
    if (byTitle.has(tag.title)) {
      console.log(`已存在标签：${tag.title}`);
      continue;
    }
    await request("/api/articles/tags", {
      method: "PUT",
      token,
      body: tag,
    });
    console.log(`创建标签：${tag.title}`);
  }
  options = await getTagOptions(token);
  return new Map(options.map((item) => [item.title, item]));
}

async function findArticleByTitle(token, title) {
  const data = await request("/api/search/articles", {
    token,
    query: {
      type: 5,
      key: title,
      page: 1,
      limit: 20,
      page_mode: "count",
    },
  });
  const list = ensureListShape(data);
  return list.find((item) => item.title === title) ?? null;
}

function findArticleByTitleFromDb(title) {
  const escaped = title.replace(/'/g, "''");
  const rows = queryMysql(
    `SELECT a.id, a.title, a.status, a.author_id, COALESCE(a.category_id, 0) AS category_id, GROUP_CONCAT(at.tag_id ORDER BY at.tag_id SEPARATOR ',') AS tag_ids
     FROM article_models a
     LEFT JOIN article_tag_models at ON at.article_id = a.id AND at.deleted_at IS NULL
     WHERE a.title='${escaped}'
     GROUP BY a.id, a.title, a.status, a.author_id, a.category_id
     ORDER BY a.created_at DESC
     LIMIT 1;`,
  );
  if (!rows.length) return null;
  const [id, fetchedTitle, status, authorId, categoryId, tagIds] = rows[0];
  return {
    id: String(id),
    title: fetchedTitle,
    status: Number(status),
    author_id: String(authorId),
    category_id: categoryId && categoryId !== "0" ? String(categoryId) : null,
    tag_ids: tagIds ? tagIds.split(",").map((item) => String(item)).filter(Boolean) : [],
  };
}

async function ensureArticles(token, categoryMap, tagMap) {
  logStep("文章");
  const created = [];
  for (const article of articleDefinitions) {
    const desiredCategoryId = categoryMap.get(article.category)?.id ?? null;
    const desiredTagIds = article.tags.map((name) => tagMap.get(name)?.id).filter(Boolean);
    const existed = findArticleByTitleFromDb(article.title) ?? (await findArticleByTitle(token, article.title));
    if (existed) {
      console.log(`已存在文章：${article.title}`);
      const needUpdate =
        String(existed.category_id || "") !== String(desiredCategoryId || "") ||
        JSON.stringify([...(existed.tag_ids || [])].sort()) !== JSON.stringify([...desiredTagIds].sort());
      if (needUpdate) {
        await request(`/api/articles/${existed.id}`, {
          method: "PUT",
          token,
          body: buildArticleUpdateBody(article, desiredCategoryId, desiredTagIds),
        });
        console.log(`补齐文章分类/标签：${article.title}`);
      }
      created.push(existed);
      continue;
    }
    await request("/api/articles", {
      method: "POST",
      token,
      body: buildArticleBody(article, desiredCategoryId, desiredTagIds),
    });
    let fresh = null;
    for (let i = 0; i < 5; i += 1) {
      fresh = findArticleByTitleFromDb(article.title) ?? (await findArticleByTitle(token, article.title));
      if (fresh) break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (fresh) {
      console.log(`创建文章：${article.title}`);
      created.push(fresh);
      continue;
    }
    console.log(`文章已提交创建，但暂未拿到回查结果：${article.title}`);
  }
  return created;
}

async function ensureAdminTopArticles(token, articles) {
  logStep("首页置顶");
  const current = await request("/api/articles/top", {
    token,
    query: { type: 2 },
  });
  const topIds = new Set(ensureListShape(current).map((item) => String(item.id)));
  for (const article of articles.filter((item) => articleDefinitions.find((def) => def.title === item.title)?.top)) {
    if (topIds.has(String(article.id))) {
      console.log(`已置顶文章：${article.title}`);
      continue;
    }
    await request("/api/articles/top", {
      method: "POST",
      token,
      body: `{"article_id": ${toJsonIdLiteral(article.id)}, "type": 2}`,
    });
    console.log(`新增置顶文章：${article.title}`);
  }
}

async function ensureBanners(token) {
  logStep("轮播图");
  const current = ensureListShape(
    await request("/api/banners", {
      token,
      query: {
        page: 1,
        limit: 20,
      },
    }),
  );
  const existingKeys = new Set(current.map((item) => `${item.cover}|${item.href ?? ""}`));
  for (const banner of bannerDefinitions) {
    const key = `${banner.cover}|${banner.href ?? ""}`;
    if (existingKeys.has(key)) {
      console.log(`已存在轮播图：${banner.href || banner.cover}`);
      continue;
    }
    await request("/api/banners", {
      method: "POST",
      token,
      body: banner,
    });
    console.log(`创建轮播图：${banner.href || banner.cover}`);
  }
}

async function ensureGlobalNotifs(token) {
  logStep("全局通知");
  for (const notif of globalNotifDefinitions) {
    try {
      await request("/api/global_notif", {
        method: "POST",
        token,
        body: notif,
      });
      console.log(`创建全局通知：${notif.title}`);
    } catch (error) {
      if (error instanceof ApiError && String(error.payload?.msg || "").includes("标题重复")) {
        console.log(`已存在全局通知：${notif.title}`);
        continue;
      }
      throw error;
    }
  }
}

async function main() {
  console.log(`使用 API 入口：${baseUrl}`);
  const token = await loginAsAdmin();
  console.log(`管理员登录成功：${config.adminLogin}`);

  await ensureSiteRuntime(token);
  const categoryMap = await ensureCategories(token);
  const tagMap = await ensureTags(token);
  const articles = await ensureArticles(token, categoryMap, tagMap);
  await ensureAdminTopArticles(token, articles);
  await ensureBanners(token);
  await ensureGlobalNotifs(token);

  console.log("\n全部基础资源已通过 API 确保完成。");
  console.log("后续如果要补普通用户注册、评论、关注、私信，可继续在这个脚本上扩展。");
}

main().catch((error) => {
  console.error("\n灌数失败：");
  console.error(error.message);
  if (error.payload) {
    console.error(JSON.stringify(error.payload, null, 2));
  }
  process.exitCode = 1;
});
