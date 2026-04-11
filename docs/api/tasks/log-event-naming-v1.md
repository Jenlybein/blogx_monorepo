# 日志事件命名规范（冻结版 v1）

## 1. 命名格式

1. 统一使用小写蛇形：`<domain>_<action>_<result>`。
2. 仅允许 `a-z`、`0-9`、`_`。
3. 长度建议 `<= 64`。

## 2. 语义约束

1. `domain`：业务域或模块域，例如 `http`、`login`、`audit`、`river`、`image_ref`、`replay`。
2. `action`：本次动作，例如 `request`、`auth`、`projection`、`sync`、`process`。
3. `result`：结果态，例如 `success`、`failed`、`retry`、`dlq`、`started`。

## 3. 推荐事件清单（v1）

1. 运行日志：`http_request_success`、`http_request_failed`
2. 登录日志：`login_success`、`login_fail`、`logout_success`、`token_refresh_success`
3. 审计日志：`audit_action_success`、`audit_action_failed`
4. ES River：`river_projection_success`、`river_projection_retry`、`river_projection_dlq`
5. ImageRef River：`image_ref_sync_success`、`image_ref_sync_retry`、`image_ref_sync_dlq`
6. 回放日志：`replay_started`、`replay_success`、`replay_failed`

## 4. 禁止命名

1. 禁止无语义名称：`ok`、`done`、`task_done`、`process_ok`。
2. 禁止中英文混写或驼峰：`RiverSyncOK`、`river同步成功`。
3. 禁止把错误信息拼进事件名（错误明细应放 `error_code/error_message/extra_json`）。
