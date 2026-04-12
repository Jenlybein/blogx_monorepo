# 测试环境 API 灌数脚本

脚本位置：

- `scripts/seed-test-env-by-api.mjs`

目标：

- 只通过真实后端接口写入测试数据
- 默认可重复执行
- 避免裸 SQL 覆盖整库
- 当前仅覆盖 web 前台主链路需要的基础资源

当前会确保的资源：

- 站点 runtime 配置
- 分类
- 标签
- 已发布文章
- 首页管理员置顶
- banner
- 全局通知

默认读取：

- `.envrc` 里的测试环境地址、图片域名、管理员登录邮箱

可覆盖环境变量：

- `BLOGX_SEED_BASE_URL`
- `BLOGX_SEED_ADMIN_LOGIN`
- `BLOGX_SEED_ADMIN_PASSWORD`
- `BLOGX_WEB_SITE_HOST`

运行：

```powershell
node ./scripts/seed-test-env-by-api.mjs
```

如果管理员账号不是邮箱登录，也可以显式指定：

```powershell
$env:BLOGX_SEED_ADMIN_LOGIN='testAdmin'
$env:BLOGX_SEED_ADMIN_PASSWORD='123456123'
node ./scripts/seed-test-env-by-api.mjs
```

说明：

- 脚本目前不直接注册普通用户，因为邮箱验证码链路还需要额外处理。
- 如果后续需要补评论、关注、收藏、私信，可以继续在同一脚本里扩展。
