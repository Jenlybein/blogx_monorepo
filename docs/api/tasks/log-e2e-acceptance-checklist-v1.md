# 日志系统端到端验收清单（冻结版 v1）

## 1. 字段完整性验收

1. 运行、登录、审计、CDC、回放五类日志均包含核心 12 列。
2. `extra_json` 可解析且关键扩展键写入正确。
3. `event_name` 命名符合 `domain_action_result` 规范。

## 2. 链路贯通验收

1. 有网关透传时：`trace_id` 继承透传值。
2. 无网关透传时：服务本地生成 32 hex `trace_id`。
3. `request_id` 默认等于最终 `trace_id`。

## 3. 重试与 DLQ 验收

1. River / ImageRef River 失败后按固定间隔重试一次。
2. 二次失败后写入 `cdc_dead_letter`。
3. `cdc_dead_letter.cdc_job_id` 与 `cdc_event_logs.cdc_job_id` 可关联。

## 4. 回放验收

1. 回放任务可按 `pending` 批量读取死信。
2. 回放结果写入 `replay_event_logs`。
3. 回放后 `cdc_dead_letter.status` 正确更新。

## 5. 权限与脱敏验收

1. 普通角色默认不可见 `error.stack` 等敏感字段。
2. `Authorization/Cookie/token/password` 字段默认脱敏。
3. 审计 body 按白名单和长度限制输出。

## 6. 告警验收

1. `cdc_dlq_pending_count` 告警可触发。
2. 连续失败告警可触发。
3. 回放失败率告警可触发。

## 7. 实现任务映射

1. L1 任务：ClickHouse 五表建表、Fluent Bit 路由、`cdc_dead_letter` 迁移。
2. L2 任务：统一日志构建器、trace 继承策略、三道闸门、13 项配置接入。
3. L3/L4 任务：重试、DLQ、回放、告警看板（后续阶段）。

## 8. 验证命令建议

1. `SHOW TABLES FROM blogx_logs;`
2. `SELECT count() FROM blogx_logs.runtime_logs;`（其余四表同理）
3. `SELECT trace_id, request_id FROM blogx_logs.runtime_logs ORDER BY ts DESC LIMIT 20;`
4. `SELECT cdc_job_id, result FROM blogx_logs.cdc_event_logs ORDER BY ts DESC LIMIT 20;`
5. `SELECT stream,status,retry_count,cdc_job_id FROM cdc_dead_letter ORDER BY created_at DESC LIMIT 20;`
