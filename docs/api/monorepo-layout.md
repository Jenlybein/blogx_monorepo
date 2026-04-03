# API Monorepo 整理说明

这次整理的目标是让 `apps/api` 只保留后端应用本体，把部署资产、持久化占位目录和仓库级脚本提取到 monorepo 对应位置。

## 当前分层

```text
apps/api
  cmd/server        # 服务入口
  api               # Handler / 接口实现
  router            # 路由注册
  middleware        # Gin 中间件
  service           # 业务服务
  models            # GORM 模型与枚举
  core              # 基础设施初始化
  conf              # 配置结构定义
  config            # 运行配置模板
  resources         # 应用运行所需静态资源
  common/utils      # 通用工具与响应封装
  test              # 集成测试与测试辅助

deploy/compose/local
  docker-compose.yml  # 本地联调编排

deploy/docker
  api                 # API 镜像构建文件
  es                  # Elasticsearch 镜像构建文件
  mysql               # MySQL 主从初始化文件
  redis/nginx/fluent-bit/clickhouse/kafka
                      # 基础设施容器配置

deploy/state
  api                 # API 日志、上传、river 位点
  mysql               # MySQL 数据与日志
  redis/es/clickhouse/nginx/fluent-bit/kafka
                      # 运行时持久化目录占位

docs/api
  records             # 后端开发记录与长文档
  architecture        # 架构图、Mermaid 草图
  tasks               # 待办与后续演进事项

openapi/api
  myblogx.openapi.json # API OpenAPI 描述文件

scripts/api
  git_desensitize.sh  # API 配置脱敏脚本
```

## 调整原则

1. 不在这次整理里大规模改动 Go 包 import 路径，先保证结构清晰且可运行。
2. `apps/api` 仅保留“应用代码 + 应用配置 + 应用资源”。
3. 所有容器编排、镜像构建与持久化目录统一收口到根目录 `deploy/`。
4. 让 Go 后端也能像前端应用一样被 workspace 脚本统一调度。
5. 原 `apps/api/.read` 资料层已拆分到 `docs/api` 与 `openapi/api`，避免文档继续混入应用目录。
