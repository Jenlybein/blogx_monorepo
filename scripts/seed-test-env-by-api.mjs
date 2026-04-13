import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import net from "node:net";

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
  seedEmail: getEnv("BLOGX_SEED_EMAIL", getEnv("BLOGX_SMTP_USERNAME", "")),
  seedEmailPassword: getEnv("BLOGX_SEED_EMAIL_PASSWORD", "BlogxEmail123"),
  imageDomain: getEnv("BLOGX_QINIU_DOMAIN", "https://image.gentlybeing.cn"),
  siteHost: getEnv("BLOGX_WEB_SITE_HOST", "http://gentlybeing.cn"),
  dbHost: getEnv("BLOGX_DB_MASTER_HOST", ""),
  dbPort: getEnv("BLOGX_DB_MASTER_PORT", "3306"),
  dbUser: getEnv("BLOGX_DB_USER", ""),
  dbPassword: getEnv("BLOGX_DB_PASSWORD", ""),
  dbName: getEnv("BLOGX_DB_NAME", ""),
  redisHost: getEnv("BLOGX_REDIS_HOST", ""),
  redisPort: Number(getEnv("BLOGX_REDIS_PORT", "6379")),
  redisUser: getEnv("BLOGX_REDIS_USERNAME", ""),
  redisPassword: getEnv("BLOGX_REDIS_PASSWORD", ""),
  redisDb: Number(getEnv("BLOGX_REDIS_DB", "0")),
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

function firstRow(sql) {
  const rows = queryMysql(sql);
  return rows[0] ?? null;
}

function sqlEscape(value) {
  return String(value).replace(/'/g, "''");
}

function buildJsonObjectBody(input) {
  const parts = Object.entries(input)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `"${key}": ${JSON.stringify(value)}`);
  return `{${parts.join(", ")}}`;
}

function buildUserInfoBody(input) {
  const parts = Object.entries(input)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `"${key}": [${value.map((item) => toJsonIdLiteral(item)).join(",")}]`;
      }
      if (typeof value === "boolean") {
        return `"${key}": ${value}`;
      }
      if (value === null) {
        return `"${key}": null`;
      }
      return `"${key}": ${JSON.stringify(value)}`;
    });
  return `{${parts.join(", ")}}`;
}

async function readSocketChunks(socket) {
  const chunks = [];
  for await (const chunk of socket) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function encodeRedisCommand(args) {
  let result = `*${args.length}\r\n`;
  for (const arg of args) {
    const value = String(arg);
    result += `$${Buffer.byteLength(value)}\r\n${value}\r\n`;
  }
  return Buffer.from(result);
}

function parseRedisValue(buffer, start = 0) {
  const type = String.fromCharCode(buffer[start]);
  const lineEnd = buffer.indexOf("\r\n", start);
  if (lineEnd < 0) throw new Error("Redis 响应解析失败：缺少行尾");
  const payload = buffer.toString("utf8", start + 1, lineEnd);

  if (type === "+") return { value: payload, next: lineEnd + 2 };
  if (type === "-") throw new Error(`Redis 错误：${payload}`);
  if (type === ":") return { value: Number(payload), next: lineEnd + 2 };
  if (type === "$") {
    const length = Number(payload);
    if (length === -1) {
      return { value: null, next: lineEnd + 2 };
    }
    const dataStart = lineEnd + 2;
    const dataEnd = dataStart + length;
    return { value: buffer.toString("utf8", dataStart, dataEnd), next: dataEnd + 2 };
  }
  if (type === "*") {
    const count = Number(payload);
    if (count === -1) {
      return { value: null, next: lineEnd + 2 };
    }
    const list = [];
    let offset = lineEnd + 2;
    for (let i = 0; i < count; i += 1) {
      const parsed = parseRedisValue(buffer, offset);
      list.push(parsed.value);
      offset = parsed.next;
    }
    return { value: list, next: offset };
  }
  throw new Error(`Redis 响应类型不支持：${type}`);
}

async function redisCommand(...args) {
  if (!config.redisHost || !config.redisPassword) {
    throw new Error("缺少 Redis 只读连接信息，无法读取邮箱验证码");
  }

  const socket = net.createConnection({
    host: config.redisHost,
    port: config.redisPort,
  });

  await new Promise((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("error", reject);
  });

  const commands = [];
  if (config.redisUser) {
    commands.push(["AUTH", config.redisUser, config.redisPassword]);
  } else {
    commands.push(["AUTH", config.redisPassword]);
  }
  commands.push(["SELECT", String(config.redisDb)]);
  commands.push(args);

  for (const command of commands) {
    socket.write(encodeRedisCommand(command));
  }
  socket.end();

  const buffer = await readSocketChunks(socket);
  let offset = 0;
  let lastValue = null;
  for (let i = 0; i < commands.length; i += 1) {
    const parsed = parseRedisValue(buffer, offset);
    lastValue = parsed.value;
    offset = parsed.next;
  }
  return lastValue;
}

async function readEmailCodeById(emailId) {
  return redisCommand("HGET", `email_verify:${emailId}`, "code");
}

async function findPendingEmailCode(email) {
  const keys = (await redisCommand("KEYS", "email_verify:*")) ?? [];
  for (const key of keys) {
    const fields = (await redisCommand("HGETALL", key)) ?? [];
    const map = {};
    for (let i = 0; i < fields.length; i += 2) {
      map[fields[i]] = fields[i + 1];
    }
    if (map.email === email && map.code) {
      return {
        id: key.replace(/^email_verify:/, ""),
        code: map.code,
      };
    }
  }
  return null;
}

async function waitForEmailCode(emailId, email) {
  for (let i = 0; i < 10; i += 1) {
    const directCode = emailId ? await readEmailCodeById(emailId) : null;
    if (directCode) return { id: emailId, code: directCode };
    if (email) {
      const pending = await findPendingEmailCode(email);
      if (pending?.code) return pending;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  return null;
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

const seedUserDefinitions = [
  {
    username: "asterSeed",
    password: "Aster123456",
    nickname: "Aster",
    abstract: "前端架构 / 文档体验",
    avatar: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
    likeTags: ["Nuxt", "Vue3", "Monorepo"],
  },
  {
    username: "riverSeed",
    password: "River123456",
    nickname: "River",
    abstract: "平台治理 / 搜索链路",
    avatar: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
    likeTags: ["OpenAPI", "搜索", "Nuxt"],
  },
  {
    username: "louisSeed",
    password: "Louis123456",
    nickname: "Louis",
    abstract: "运营后台 / 数据看板",
    avatar: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
    likeTags: ["SSR", "Monorepo"],
  },
];

const authoredArticleDefinitions = [
  {
    owner: "asterSeed",
    title: "Nuxt 4 页面数据编排与 SSR 安全实践",
    abstract: "从 useAsyncData、缓存 key 到 SEO 渲染，梳理公开页面在 Nuxt 4 下的可维护写法。",
    content: [
      "# Nuxt 4 页面数据编排与 SSR 安全实践",
      "",
      "用于测试作者主页、搜索结果和文章详情的真实内容链路。",
      "",
      "## 关注点",
      "",
      "- useAsyncData key 稳定",
      "- SSR 首屏确定性",
      "- 页面级 SEO 组装",
    ].join("\n"),
    category: "前端架构",
    tags: ["Nuxt", "SSR", "Vue3"],
    cover: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
  },
  {
    owner: "asterSeed",
    title: "组件拆分与可复用 composable 的边界",
    abstract: "把页面容器、展示组件和可适配 composable 分开，能让后续迭代更稳定。",
    content: [
      "# 组件拆分与可复用 composable 的边界",
      "",
      "适合测试个人主页里的多篇文章列表。",
      "",
      "## 经验",
      "",
      "- route 页面做编排",
      "- composable 处理状态与副作用",
      "- 组件聚焦单一职责",
    ].join("\n"),
    category: "工程化",
    tags: ["Vue3", "Monorepo", "Nuxt"],
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
  },
  {
    owner: "riverSeed",
    title: "搜索与 ES 投影链路排障记录",
    abstract: "记录从 MySQL、River 到 ES 索引的排障路径，帮助前端快速判断问题边界。",
    content: [
      "# 搜索与 ES 投影链路排障记录",
      "",
      "这一篇用于验证搜索页和作者主页中的搜索结果命中。",
      "",
      "## 排障线索",
      "",
      "- MySQL 是否有数据",
      "- ES 索引是否写入",
      "- 接口是否直接查 ES",
    ].join("\n"),
    category: "接口设计",
    tags: ["搜索", "OpenAPI", "Nuxt"],
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
  },
  {
    owner: "riverSeed",
    title: "评论与消息中心的读模型设计",
    abstract: "把评论树、站内消息与私信会话拆成不同读模型，前端状态会更清晰。",
    content: [
      "# 评论与消息中心的读模型设计",
      "",
      "用于补齐消息中心和文章详情评论页的真实互动数据来源。",
      "",
      "## 读模型建议",
      "",
      "- 评论树单独分页",
      "- 站内消息做分类读模型",
      "- 私信会话和消息分离",
    ].join("\n"),
    category: "接口设计",
    tags: ["搜索", "OpenAPI", "Vue3"],
    cover: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
  },
  {
    owner: "louisSeed",
    title: "个人中心与数据概览的页面组织方式",
    abstract: "围绕个人数据概览、我的文章、浏览历史和消息中心做清晰的页面分层。",
    content: [
      "# 个人中心与数据概览的页面组织方式",
      "",
      "适合测试个人中心与作者主页之间的数据呼应。",
      "",
      "## 页面结构",
      "",
      "- 数据概览",
      "- 我的文章",
      "- 浏览历史",
      "- 消息中心",
    ].join("\n"),
    category: "工程化",
    tags: ["Monorepo", "SSR", "Vue3"],
    cover: `${config.imageDomain}/myblogx/images/20260328/Fm8TSAox63x45bd-hrHs87ZQPSxx`,
  },
];

const favoriteDefinitions = [
  {
    owner: "seedEmail",
    title: "架构收藏夹",
    abstract: "收录 Nuxt、OpenAPI 与前端架构的测试环境内容。",
    cover: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
    articleTitles: [
      "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程",
      "Nuxt 4 页面数据编排与 SSR 安全实践",
    ],
  },
];

const followDefinitions = [
  { from: "seedEmail", to: "asterSeed" },
  { from: "seedEmail", to: "riverSeed" },
  { from: "asterSeed", to: "seedEmail" },
  { from: "riverSeed", to: "asterSeed" },
];

const articleDiggDefinitions = [
  { user: "seedEmail", articleTitle: "Nuxt 4 页面数据编排与 SSR 安全实践" },
  { user: "riverSeed", articleTitle: "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程" },
  { user: "louisSeed", articleTitle: "搜索与 ES 投影链路排障记录" },
];

const commentDefinitions = [
  {
    key: "seed-root-1",
    user: "seedEmail",
    articleTitle: "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程",
    content: "[seed-email-root] 这版接口和页面结构已经很接近正式联调了，下一步可以继续补齐搜索与用户主页的联动。",
  },
  {
    key: "river-reply-1",
    user: "riverSeed",
    articleTitle: "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程",
    replyTo: "seed-root-1",
    content: "[seed-river-reply] 搜索链路现在已经能通过 ES 命中了，前端只要继续围绕真实参数做收口就行。",
  },
  {
    key: "louis-reply-1",
    user: "louisSeed",
    articleTitle: "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程",
    replyTo: "seed-root-1",
    content: "[seed-louis-reply] 个人中心这边建议把浏览历史、收藏和消息中心都补上真实数据，这样联调感受会完整很多。",
  },
  {
    key: "aster-root-1",
    user: "asterSeed",
    articleTitle: "搜索接口驱动的前端筛选设计",
    content: "[seed-aster-root] 搜索页把筛选收成一层之后，公开页和个人页复用起来就会轻很多。",
  },
];

function findUserByUsernameFromDb(username) {
  const row = firstRow(
    `SELECT id, username, nickname, COALESCE(email, '') AS email
     FROM user_models
     WHERE username='${sqlEscape(username)}'
     LIMIT 1;`,
  );
  if (!row) return null;
  const [id, fetchedUsername, nickname, email] = row;
  return {
    id: String(id),
    username: fetchedUsername,
    nickname,
    email: email || null,
  };
}

function findUserByEmailFromDb(email) {
  const row = firstRow(
    `SELECT id, username, nickname, COALESCE(email, '') AS email
     FROM user_models
     WHERE email='${sqlEscape(email)}'
     LIMIT 1;`,
  );
  if (!row) return null;
  const [id, username, nickname, fetchedEmail] = row;
  return {
    id: String(id),
    username,
    nickname,
    email: fetchedEmail || null,
  };
}

function findCommentBySignatureFromDb(articleId, userId, content) {
  const row = firstRow(
    `SELECT id, COALESCE(root_id, 0), COALESCE(reply_id, 0)
     FROM comment_models
     WHERE article_id='${sqlEscape(articleId)}'
       AND user_id='${sqlEscape(userId)}'
       AND content='${sqlEscape(content)}'
       AND deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT 1;`,
  );
  if (!row) return null;
  const [id, rootId, replyId] = row;
  return {
    id: String(id),
    root_id: rootId && rootId !== "0" ? String(rootId) : null,
    reply_id: replyId && replyId !== "0" ? String(replyId) : null,
  };
}

async function loginWithPassword(username, password) {
  return request("/api/users/login", {
    method: "POST",
    body: {
      username,
      password,
    },
  });
}

async function getCurrentUserDetail(token) {
  return request("/api/users/detail", { token });
}

async function sendEmailVerify(type, email) {
  try {
    return await request("/api/users/email/verify", {
      method: "POST",
      body: { type, email },
    });
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (!String(error.payload?.msg || "").includes("请求过于频繁")) {
      throw error;
    }
    const pending = await findPendingEmailCode(email);
    if (!pending) {
      console.log(`邮箱验证码发送被限流，等待 65 秒后重试：${email}`);
      await new Promise((resolve) => setTimeout(resolve, 65000));
      return request("/api/users/email/verify", {
        method: "POST",
        body: { type, email },
      });
    }
    return { id: pending.id, reused: true };
  }
}

async function ensureEmailSeedUser(tagMap) {
  logStep("邮箱注册 / 登录链路");
  if (!config.seedEmail) {
    throw new Error("缺少 BLOGX_SEED_EMAIL 或 BLOGX_SMTP_USERNAME，无法测试邮箱链路");
  }

  const existing = findUserByEmailFromDb(config.seedEmail);
  if (existing?.username === config.adminLogin) {
    console.log(`跳过邮箱普通用户注册：${config.seedEmail} 当前仍绑定管理员 ${config.adminLogin}`);
    return null;
  }
  const verifyType = existing ? 4 : 1;
  const verify = await sendEmailVerify(verifyType, config.seedEmail);
  const verifyPayload = await waitForEmailCode(verify.id, config.seedEmail);

  if (!verifyPayload?.code) {
    throw new Error("未能从 Redis 读取邮箱验证码");
  }

  let token = null;
  if (existing) {
    token = await request("/api/users/email/login", {
      method: "POST",
      body: {
        email_id: verifyPayload.id,
        email_code: verifyPayload.code,
      },
    });
    console.log(`邮箱用户登录成功：${config.seedEmail}`);
  } else {
    token = await request("/api/users/email/register", {
      method: "POST",
      body: {
        email_id: verifyPayload.id,
        email_code: verifyPayload.code,
        pwd: config.seedEmailPassword,
      },
    });
    console.log(`邮箱用户注册成功：${config.seedEmail}`);
  }

  const detail = await getCurrentUserDetail(token);
  await request("/api/users/info", {
    method: "PUT",
    token,
    body: buildUserInfoBody({
      nickname: "GentlyBeing",
      avatar: `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`,
      abstract: "视当下为结果，便会绝望；视其为过程，则仍有转机。",
    }),
  });
  const updated = await getCurrentUserDetail(token);
  return {
    key: "seedEmail",
    id: String(updated.id),
    username: updated.username,
    nickname: updated.nickname,
    token,
    password: config.seedEmailPassword,
    email: config.seedEmail,
  };
}

async function ensureAdminCreatedUsers(adminToken, tagMap) {
  logStep("管理员创建普通用户");
  const result = [];
  for (const user of seedUserDefinitions) {
    const existing = findUserByUsernameFromDb(user.username);
    if (!existing) {
      await request("/api/users/admin", {
        method: "POST",
        token: adminToken,
        body: {
          username: user.username,
          password: user.password,
          nickname: user.nickname,
        },
      });
      console.log(`管理员创建用户：${user.username}`);
    } else {
      console.log(`已存在普通用户：${user.username}`);
    }

    const token = await loginWithPassword(user.username, user.password);
    const detail = await getCurrentUserDetail(token);
    await request("/api/users/info", {
      method: "PUT",
      token,
      body: buildUserInfoBody({
        nickname: user.nickname,
        avatar: user.avatar,
        abstract: user.abstract,
      }),
    });
    const updated = await getCurrentUserDetail(token);
    result.push({
      key: user.username,
      id: String(updated.id),
      username: updated.username,
      nickname: updated.nickname,
      token,
      password: user.password,
    });
  }
  return result;
}

async function ensureFallbackSeedViewer(adminToken, tagMap) {
  logStep("补充默认联调用户");
  const username = "gentlySeed";
  const password = "Gently123456";
  const nickname = "GentlyBeing";
  const abstract = "视当下为结果，便会绝望；视其为过程，则仍有转机。";
  const avatar = `${config.imageDomain}/myblogx/images/20260328/ljZa0YMcc2u6lyAqG-ALnuhewGrY`;

  const existing = findUserByUsernameFromDb(username);
  if (!existing) {
    await request("/api/users/admin", {
      method: "POST",
      token: adminToken,
      body: {
        username,
        password,
        nickname,
      },
    });
    console.log(`管理员创建兜底联调用户：${username}`);
  } else {
    console.log(`已存在兜底联调用户：${username}`);
  }

  const token = await loginWithPassword(username, password);
  await request("/api/users/info", {
    method: "PUT",
    token,
    body: buildUserInfoBody({
      nickname,
      avatar,
      abstract,
    }),
  });
  const detail = await getCurrentUserDetail(token);
  return {
    key: "seedEmail",
    id: String(detail.id),
    username: detail.username,
    nickname: detail.nickname,
    token,
    password,
    email: null,
  };
}

async function loginByEmail(email) {
  const verify = await sendEmailVerify(4, email);
  const verifyPayload = await waitForEmailCode(verify.id, email);
  if (!verifyPayload?.code) {
    throw new Error("未能读取邮箱登录验证码");
  }
  return request("/api/users/email/login", {
    method: "POST",
    body: {
      email_id: verifyPayload.id,
      email_code: verifyPayload.code,
    },
  });
}

async function loginAsAdmin() {
  const adminByEmail = config.seedEmail ? findUserByEmailFromDb(config.seedEmail) : null;
  if (adminByEmail?.username === config.adminLogin) {
    const token = await loginByEmail(config.seedEmail);
    return { token, mode: "email" };
  }

  try {
    const token = await request("/api/users/login", {
      method: "POST",
      body: {
        username: config.adminLogin,
        password: config.adminPassword,
      },
    });
    return { token, mode: "password" };
  } catch (error) {
    if (!(error instanceof ApiError) || !String(error.payload?.msg || "").includes("账号或密码错误")) {
      throw error;
    }
    if (!adminByEmail || adminByEmail.username !== config.adminLogin) {
      throw error;
    }
    const token = await loginByEmail(config.seedEmail);
    return { token, mode: "email" };
  }
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

async function ensureCategories(token, stepTitle = "分类") {
  logStep(stepTitle);
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
    query: {
      type: 1,
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

async function ensureArticleBatch(token, defs, categoryMap, tagMap, title = "文章") {
  logStep(title);
  const created = [];
  for (const article of defs) {
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

async function ensureArticles(token, categoryMap, tagMap) {
  return ensureArticleBatch(token, articleDefinitions, categoryMap, tagMap, "文章");
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

function findFavoriteByTitleFromDb(userId, title) {
  const row = firstRow(
    `SELECT id
     FROM favorite_models
     WHERE user_id='${sqlEscape(userId)}'
       AND title='${sqlEscape(title)}'
       AND deleted_at IS NULL
     LIMIT 1;`,
  );
  if (!row) return null;
  return {
    id: String(row[0]),
  };
}

async function ensureFavoriteFolders(seedUsersByKey, articleMap) {
  logStep("收藏夹与收藏关系");
  for (const favorite of favoriteDefinitions) {
    const owner = seedUsersByKey.get(favorite.owner);
    if (!owner) {
      throw new Error(`收藏夹归属用户不存在：${favorite.owner}`);
    }

    let favor = findFavoriteByTitleFromDb(owner.id, favorite.title);
    if (!favor) {
      const created = await request("/api/articles/favorite", {
        method: "PUT",
        token: owner.token,
        body: {
          title: favorite.title,
          cover: favorite.cover,
          abstract: favorite.abstract,
        },
      });
      favor = { id: String(created.id) };
      console.log(`创建收藏夹：${favorite.title}`);
    } else {
      console.log(`已存在收藏夹：${favorite.title}`);
    }

    for (const articleTitle of favorite.articleTitles) {
      const article = articleMap.get(articleTitle);
      if (!article) continue;
      const detail = await request(`/api/articles/${article.id}`, {
        token: owner.token,
      });
      if (detail.is_favor) {
        console.log(`已收藏文章：${articleTitle}`);
        continue;
      }
      await request("/api/articles/favorite", {
        method: "POST",
        token: owner.token,
        body: buildJsonObjectBody({
          article_id: article.id,
          favor_id: favor.id,
        }),
      });
      console.log(`收藏文章：${articleTitle}`);
    }
  }
}

async function ensureFollowRelations(seedUsersByKey) {
  logStep("关注关系");
  for (const relation of followDefinitions) {
    const fromUser = seedUsersByKey.get(relation.from);
    const toUser = seedUsersByKey.get(relation.to);
    if (!fromUser || !toUser) continue;
    const baseInfo = await request("/api/users/base", {
      token: fromUser.token,
      query: {
        id: toUser.id,
      },
    });
    if ([2, 4].includes(Number(baseInfo.relation))) {
      console.log(`已关注：${fromUser.nickname} -> ${toUser.nickname}`);
      continue;
    }
    await request(`/api/follow/${toUser.id}`, {
      method: "POST",
      token: fromUser.token,
    });
    console.log(`新增关注：${fromUser.nickname} -> ${toUser.nickname}`);
  }
}

function findCommentByDefinition(comment, seedUsersByKey, articleMap) {
  const author = seedUsersByKey.get(comment.user);
  const article = articleMap.get(comment.articleTitle);
  if (!author || !article) return null;
  return findCommentBySignatureFromDb(article.id, author.id, comment.content);
}

async function ensureComments(seedUsersByKey, articleMap) {
  logStep("评论与回复");
  const commentKeyMap = new Map();
  for (const definition of commentDefinitions) {
    const author = seedUsersByKey.get(definition.user);
    const article = articleMap.get(definition.articleTitle);
    if (!author || !article) {
      throw new Error(`评论依赖不存在：${definition.key}`);
    }
    const existing = findCommentByDefinition(definition, seedUsersByKey, articleMap);
    if (existing) {
      commentKeyMap.set(definition.key, existing);
      console.log(`已存在评论：${definition.key}`);
      continue;
    }

    const replyTarget = definition.replyTo ? commentKeyMap.get(definition.replyTo) : null;
    const created = await request("/api/comments", {
      method: "POST",
      token: author.token,
      body: buildJsonObjectBody({
        article_id: article.id,
        content: definition.content,
        reply_id: replyTarget?.id,
      }),
    });
    const createdInfo = {
      id: String(created.id),
      root_id: created.root_id ? String(created.root_id) : null,
      reply_id: created.reply_id ? String(created.reply_id) : null,
    };
    commentKeyMap.set(definition.key, createdInfo);
    console.log(`创建评论：${definition.key}`);
  }
  return commentKeyMap;
}

async function ensureArticleDiggs(seedUsersByKey, articleMap) {
  logStep("文章点赞");
  for (const item of articleDiggDefinitions) {
    const user = seedUsersByKey.get(item.user);
    const article = articleMap.get(item.articleTitle);
    if (!user || !article) continue;
    const detail = await request(`/api/articles/${article.id}`, {
      token: user.token,
    });
    if (detail.is_digg) {
      console.log(`已点赞文章：${item.articleTitle}`);
      continue;
    }
    await request(`/api/articles/${article.id}/digg`, {
      method: "PUT",
      token: user.token,
    });
    console.log(`点赞文章：${item.articleTitle}`);
  }
}

async function ensureArticleViews(seedUsersByKey, articleMap) {
  logStep("浏览历史与阅读量");
  const viewPairs = [
    ["seedEmail", "基于 OpenAPI 反向设计 Nuxt Web 前端的落地过程"],
    ["seedEmail", "Nuxt 4 页面数据编排与 SSR 安全实践"],
    ["asterSeed", "搜索接口驱动的前端筛选设计"],
    ["riverSeed", "Monorepo 下的 Nuxt Web 端分层与可持续迭代"],
    ["louisSeed", "评论与消息中心的读模型设计"],
  ];
  for (const [userKey, articleTitle] of viewPairs) {
    const user = seedUsersByKey.get(userKey);
    const article = articleMap.get(articleTitle);
    if (!user || !article) continue;
    try {
      await request("/api/articles/view", {
        method: "POST",
        token: user.token,
        body: buildJsonObjectBody({
          article_id: article.id,
        }),
      });
      console.log(`记录阅读：${user.nickname} -> ${articleTitle}`);
    } catch (error) {
      console.log(`阅读记录写入失败，先跳过：${user.nickname} -> ${articleTitle}（${error.message}）`);
    }
  }
}

async function verifySearchProjection() {
  logStep("搜索链路验证");
  const data = await request("/api/search/articles", {
    query: {
      type: 1,
      key: "Nuxt",
      page: 1,
      limit: 10,
      page_mode: "count",
    },
  });
  const list = ensureListShape(data);
  console.log(`搜索命中数量：${list.length}`);
}

async function main() {
  console.log(`使用 API 入口：${baseUrl}`);
  const adminAuth = await loginAsAdmin();
  const token = adminAuth.token;
  console.log(`管理员登录成功：${config.adminLogin}（${adminAuth.mode === "password" ? "密码登录" : "邮箱登录"}）`);

  await ensureSiteRuntime(token);
  const categoryMap = await ensureCategories(token);
  const tagMap = await ensureTags(token);
  const adminArticles = await ensureArticles(token, categoryMap, tagMap);
  await ensureAdminTopArticles(token, adminArticles);
  await ensureBanners(token);
  await ensureGlobalNotifs(token);
  const emailSeedUser = (await ensureEmailSeedUser(tagMap)) ?? (await ensureFallbackSeedViewer(token, tagMap));
  const createdUsers = await ensureAdminCreatedUsers(token, tagMap);

  const seedUsersByKey = new Map([
    [emailSeedUser.key, emailSeedUser],
    ...createdUsers.map((user) => [user.key, user]),
  ]);

  const authoredArticles = [];
  for (const user of createdUsers) {
    const defs = authoredArticleDefinitions.filter((item) => item.owner === user.key);
    if (!defs.length) continue;
    const userCategoryMap = await ensureCategories(user.token, `${user.nickname} 的分类`);
    const created = await ensureArticleBatch(user.token, defs, userCategoryMap, tagMap, `${user.nickname} 的文章`);
    authoredArticles.push(...created);
  }

  const articleMap = new Map([...adminArticles, ...authoredArticles].map((article) => [article.title, article]));

  await ensureFollowRelations(seedUsersByKey);
  await ensureFavoriteFolders(seedUsersByKey, articleMap);
  await ensureComments(seedUsersByKey, articleMap);
  await ensureArticleDiggs(seedUsersByKey, articleMap);
  await ensureArticleViews(seedUsersByKey, articleMap);
  await verifySearchProjection();

  console.log("\n全部基础资源已通过 API 确保完成。");
  console.log("邮箱登录、普通用户、文章、关注、收藏、评论都已通过 API 补齐。");
  console.log("当前测试环境的 /api/articles/view 仍返回服务器内部错误，浏览历史仅保留了跳过告警。");
}

main().catch((error) => {
  console.error("\n灌数失败：");
  console.error(error.message);
  if (error.payload) {
    console.error(JSON.stringify(error.payload, null, 2));
  }
  process.exitCode = 1;
});
