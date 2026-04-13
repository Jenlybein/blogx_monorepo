# BlogX Web

`apps/web` 是 BlogX 的公开站点与用户侧前端，基于 `Nuxt 4 + Vue 3 + Pinia + Naive UI + Tailwind CSS`。

## 环境变量

前端不要直接依赖根目录 `.envrc`。  
`Nuxt` 开发和构建最稳的方式，是在 `apps/web` 下维护自己的环境文件。

### 本地文件

- 示例文件：[.env.example](/E:/project/blogx_monorepo/apps/web/.env.example)
- 本地开发文件：[.env.local](/E:/project/blogx_monorepo/apps/web/.env.local)

当前最小必需变量：

```env
NUXT_API_ORIGIN=http://106.53.184.85
```

说明：

- `NUXT_API_ORIGIN` 只给 Nuxt 服务端使用，浏览器请求统一走同源代理 `/_backend`
- 如果直接把远端地址写进 `NUXT_PUBLIC_API_BASE`，本地开发会因为跨域和 cookie 策略更容易出问题
- `NUXT_PUBLIC_*` 会暴露到浏览器，所以这里只放确实需要公开的配置
- 数据库、Redis、JWT、SMTP 这类敏感变量继续留在后端环境里，不要写进 `apps/web`

## 安装依赖

在 monorepo 根目录执行：

```bash
pnpm install
```

## 开发启动

在仓库根目录执行：

```bash
pnpm --filter web dev
```

默认访问：

```text
http://localhost:3000
```

如果首页没有文章、搜索没有结果，先检查：

- `apps/web/.env.local` 的 `NUXT_API_ORIGIN` 是否指向了你有数据的测试环境
- 是否重启过 `pnpm --filter web dev`
- 浏览器里请求是否走了 `http://localhost:3000/_backend/...`，而不是直接请求远端域名

## 生产构建

```bash
pnpm --filter web build
```

## 类型检查

```bash
pnpm --filter web exec nuxi typecheck
```

## 当前联调约定

- 首页和搜索页都依赖公开搜索接口
- 作者主页依赖 `/api/users/base`
- 文章详情依赖 `/api/article/:id`
- 公共搜索页不再使用用户私有分类 `options`

如果后端测试环境切换了地址，只需要同步改 `apps/web/.env.local` 的 `NUXT_API_ORIGIN`。
