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
- 普通用户（管理员创建）
- 首页管理员置顶
- banner
- 全局通知
- 关注关系
- 收藏夹与文章收藏
- 评论与回复
- 文章点赞

默认读取：

- `.envrc` 里的测试环境地址、图片域名、管理员登录邮箱

可覆盖环境变量：

- `BLOGX_SEED_BASE_URL`
- `BLOGX_SEED_ADMIN_LOGIN`
- `BLOGX_SEED_ADMIN_PASSWORD`
- `BLOGX_SEED_ADMIN_PASSWORD_CANDIDATES`
- `BLOGX_SEED_ADMIN_EMAIL`
- `BLOGX_WEB_SITE_HOST`

运行：

```powershell
node ./scripts/seed-test-env-by-api.mjs
```

如果管理员账号不是邮箱登录，也可以显式指定：

```powershell
$env:BLOGX_SEED_ADMIN_LOGIN='testAdmin'
$env:BLOGX_SEED_ADMIN_PASSWORD='123456'
node ./scripts/seed-test-env-by-api.mjs
```

如果测试环境管理员密码可能调整过，可以给脚本一组候选密码，脚本会按顺序尝试，最后才回退到邮箱验证码：

```powershell
$env:BLOGX_SEED_ADMIN_PASSWORD_CANDIDATES='123456,123456123'
node ./scripts/seed-test-env-by-api.mjs
```

说明：

- 写入只走 API；MySQL / Redis 只用于只读校验和验证码读取。
- 管理员 bootstrap 默认走 `testAdmin / 123456`，也支持通过环境变量覆盖，并可配置多组候选密码。
- 如果管理员密码候选全部失败，脚本只会在显式配置 `BLOGX_SEED_ADMIN_EMAIL` 时才尝试邮箱回退登录，不会自动使用数据库中的占位邮箱。
- 如果 `.envrc` 里的邮箱仍绑定管理员，脚本会跳过“普通邮箱用户注册”，改为补一个普通联调用户，避免整条流程中断。
- 如果邮箱验证码发送或读取失败，脚本会记录告警并自动回退到兜底联调用户，不会中断整条灌数流程。
