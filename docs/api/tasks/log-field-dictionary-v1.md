# 日志字段字典（冻结版 v1）

适用范围：`runtime_logs`、`login_event_logs`、`action_audit_logs`、`cdc_event_logs`、`replay_event_logs`。

## 1. 核心 12 列（全日志类型统一）

1. `event_id`：日志行唯一 ID（雪花 ID）。
2. `ts`：事件时间（毫秒精度，`yyyy-MM-dd HH:mm:ss.SSS`）。
3. `level`：日志级别（`debug/info/warn/error`）。
4. `trace_id`：全链路 ID（32 hex）。
5. `span_id`：当前处理段 ID（16 hex，可空）。
6. `parent_span_id`：父段 ID（可空）。
7. `service`：服务名（如 `blogx_server`）。
8. `env`：运行环境（`dev/test/prod`）。
9. `instance_id`：实例标识（server_id 或 pod id）。
10. `event_name`：事件名（遵循命名规范）。
11. `error_code`：错误码（成功时为空）。
12. `error_message`：错误信息（成功时为空）。

## 2. 通用扩展列

1. `message`：人类可读日志消息。
2. `request_id`：展示别名，默认等于最终 `trace_id`。
3. `log_kind`：日志分类（`runtime/login_event/action_audit/cdc_event/replay_event`）。
4. `extra_json`：扩展字段 JSON（仅在需要时写入）。

## 3. HTTP/Audit 扩展字段（按需）

1. `method`
2. `path`
3. `status_code`
4. `latency_ms`
5. `user_id`
6. `ip`
7. `request_body`
8. `response_body`
9. `request_body_raw`
10. `response_body_raw`
11. `request_header_raw`
12. `response_header_raw`

## 4. CDC/回放 扩展字段（按需）

1. `cdc_job_id`：`{stream}:{schema}.{table}:{binlog_file}:{binlog_pos}:{row_index}`。
2. `stream`：`es_river` / `image_ref_river`。
3. `source_table`
4. `action`：`insert/update/delete/replay`
5. `target_key`
6. `retry_count`
7. `result`：`success/retry/dlq/replayed/failed`。

## 5. `extra_json` 冻结键（v1）

1. `module`
2. `host`
3. `error.type`
4. `error.stack`
5. `error.cause_chain`
6. `index`
7. `ref_type`
8. `field`
9. `error_stack_truncated`
