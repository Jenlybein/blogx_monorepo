#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="${ROOT_DIR}/deploy/state"

DIRS=(
  "deploy/state"
  "deploy/state/api"
  "deploy/state/api/logs"
  "deploy/state/api/logs/runtime_logs"
  "deploy/state/api/logs/login_event_logs"
  "deploy/state/api/logs/action_audit_logs"
  "deploy/state/api/logs/cdc_event_logs"
  "deploy/state/api/logs/replay_event_logs"
  "deploy/state/api/uploads"
  "deploy/state/api/var"
  "deploy/state/clickhouse"
  "deploy/state/clickhouse/data"
  "deploy/state/clickhouse/data/access"
  "deploy/state/clickhouse/data/data"
  "deploy/state/clickhouse/data/flags"
  "deploy/state/clickhouse/data/format_schemas"
  "deploy/state/clickhouse/data/metadata"
  "deploy/state/clickhouse/data/metadata_dropped"
  "deploy/state/clickhouse/data/preprocessed_configs"
  "deploy/state/clickhouse/data/store"
  "deploy/state/clickhouse/data/tmp"
  "deploy/state/clickhouse/data/user_files"
  "deploy/state/clickhouse/logs"
  "deploy/state/es"
  "deploy/state/es/data"
  "deploy/state/es/data/nodes"
  "deploy/state/fluent-bit"
  "deploy/state/fluent-bit/state"
  "deploy/state/mysql"
  "deploy/state/mysql/master"
  "deploy/state/mysql/master/data"
  "deploy/state/mysql/master/log"
  "deploy/state/mysql/master/mysql-files"
  "deploy/state/mysql/slave"
  "deploy/state/mysql/slave/data"
  "deploy/state/mysql/slave/log"
  "deploy/state/mysql/slave/mysql-files"
  "deploy/state/nginx"
  "deploy/state/nginx/cert"
  "deploy/state/nginx/logs"
  "deploy/state/redis"
  "deploy/state/redis/data"
  "deploy/state/redis/data/appendonlydir"
)

usage() {
  cat <<'EOF'
用法：
  bash scripts/init-state.sh

说明：
  1. 按当前项目的宿主机挂载目录骨架预创建 deploy/state 下的目录
  2. 包含现有运行期子目录，例如 es/data/nodes、clickhouse/data/access、redis/data/appendonlydir
  3. 只执行 mkdir -p，不修改权限、不修改属主、不删除已有内容
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

for dir in "${DIRS[@]}"; do
  mkdir -p "${ROOT_DIR}/${dir}"
done

echo "已完成状态目录初始化：${STATE_DIR}"
