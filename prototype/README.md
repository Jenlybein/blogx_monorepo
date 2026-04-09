# BlogX Prototype

这套原型现在已经明确拆成两部分：

- `prototype/web`：公开站点 + 创作者工作台
- `prototype/admin`：运营后台

两者都是独立可运行的 `Vite + Vue 3 + Naive UI` 原型应用，各自维护自己的页面、布局和 mock 数据。

## 运行方式

在仓库根目录执行：

```bash
pnpm install
pnpm dev:prototype:web
pnpm dev:prototype:admin
```

默认地址：

```text
web   -> http://localhost:4177
admin -> http://localhost:4178
```

如果要同时启动两者：

```bash
pnpm dev:prototype
```

## 页面范围

### web 原型

- `/`：首页
- `/articles`：文章列表
- `/article/demo`：文章详情
- `/search`：搜索页
- `/studio/dashboard`
- `/studio/editor`
- `/studio/inbox`
- `/studio/settings`
- `认证弹窗`：登录 / 注册内嵌在公开站点 header 中

### admin 原型

- `/`：后台仪表盘
- `/review`
- `/users`
- `/site`
- `/logs`
- `/media`

## 目录结构

```text
prototype/
  README.md
  web/
    package.json
    vite.config.ts
    tsconfig.json
    src/
  admin/
    package.json
    vite.config.ts
    tsconfig.json
    src/
```

## 设计说明

- UI 使用真实 `Naive UI` 组件
- 图表使用 `vue-echarts + echarts`
- `web` 与 `admin` 分开构建、分开运行
- 不接真实 API，不包含真实业务提交流程

## 后续迁移建议

- `prototype/web` 可对应正式工程的 `apps/web`
- `prototype/admin` 可对应正式工程的 `apps/admin`
