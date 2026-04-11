# 日志配置字典（冻结版 v1）

## 1. 生效策略（v1）

1. 配置源：`apps/api/config/settings.yaml`。
2. 生效方式：进程启动读取；修改后需重启进程生效。
3. 热更新策略：v1 不做运行时热更新（冻结策略，避免口径漂移）。

## 2. 第一批 13 项配置

1. `log.error.capture_stack`
   - 含义：`error.stack` 总开关。
   - 默认：`true`
   - 取值：`true/false`
2. `log.error.capture_min_level`
   - 含义：允许记录 `error.stack` 的最低级别。
   - 默认：`error`
   - 取值：`debug/info/warn/error`
3. `log.error.stack_max_bytes`
   - 含义：`error.stack` 最大字节数，超长截断。
   - 默认：`8192`
   - 取值：`1024~65536`
4. `log.trace.enabled`
   - 含义：是否生成/透传 `trace_id/span_id/parent_span_id`。
   - 默认：`true`
   - 取值：`true/false`
5. `log.trace.request_id_equals_trace_id`
   - 含义：`request_id` 是否默认等于最终 `trace_id`。
   - 默认：`true`
   - 取值：`true/false`
6. `log.trace.inherit_from_gateway`
   - 含义：是否优先继承网关透传 trace。
   - 默认：`true`
   - 取值：`true/false`
7. `log.trace.gateway_header_priority`
   - 含义：网关头读取优先级。
   - 默认：`traceparent>x-request-id`
   - 取值：字符串，支持 `>` 或 `,` 分隔
8. `log.error.cause_chain_depth`
   - 含义：`error.cause_chain` 最大展开层数。
   - 默认：`5`
   - 取值：`1~10`
9. `river.retry.max_attempts`
   - 含义：`river_service` 最大尝试次数（含首次）。
   - 默认：`2`
   - 取值：`1~10`
10. `river.retry.delay_ms`
    - 含义：`river_service` 固定重试间隔毫秒。
    - 默认：`200`
    - 取值：`50~60000`
11. `image_ref_river.retry.max_attempts`
    - 含义：`image_ref_river_service` 最大尝试次数（含首次）。
    - 默认：`2`
    - 取值：`1~10`
12. `image_ref_river.retry.delay_ms`
    - 含义：`image_ref_river_service` 固定重试间隔毫秒。
    - 默认：`200`
    - 取值：`50~60000`
13. `replay.batch_size`
    - 含义：DLQ 回放批处理大小。
    - 默认：`100`
    - 取值：`10~1000`

## 3. 三道闸门规则（冻结）

1. `capture_stack=false` 时，不记录任何 `error.stack`。
2. `level < capture_min_level` 时，不记录 `error.stack`。
3. 通过闸门后，按 `stack_max_bytes` 截断，截断时写 `extra_json.error_stack_truncated=true`。
