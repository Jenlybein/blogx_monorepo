#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
用法：
  sudo bash scripts/apply-cert.sh --domain 你的域名 --email 你的邮箱 [--force-renewal]

说明：
  1. 使用 Certbot 的 standalone 模式申请或续期证书
  2. 申请前会停止当前 compose 里的 blog_web，避免占用 80 端口
  3. 成功后会把证书复制到 deploy/state/nginx/cert/
  4. 最后会重新启动 blog_web

可选参数：
  --domain          必填，证书域名
  --email           必填，接收 Let’s Encrypt 通知的邮箱
  --force-renewal   可选，强制续期
  --service         可选，默认 blog_web
  --compose-file    可选，默认 deploy/compose/local/docker-compose.yml
  --cert-dir        可选，默认 deploy/state/nginx/cert
  --no-restart      可选，申请完成后不自动启动 nginx 容器
  --help            查看帮助
EOF
}

require_root() {
  if [[ "$(id -u)" -ne 0 ]]; then
    echo "请使用 root 或 sudo 执行此脚本" >&2
    exit 1
  fi
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/deploy/compose/local/docker-compose.yml"
SERVICE_NAME="nginx"
CERT_TARGET_DIR="${ROOT_DIR}/deploy/state/nginx/cert"
DOMAIN=""
EMAIL=""
FORCE_RENEWAL=0
AUTO_RESTART=1

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="${2:-}"
      shift 2
      ;;
    --email)
      EMAIL="${2:-}"
      shift 2
      ;;
    --force-renewal)
      FORCE_RENEWAL=1
      shift
      ;;
    --service)
      SERVICE_NAME="${2:-}"
      shift 2
      ;;
    --compose-file)
      COMPOSE_FILE="${2:-}"
      shift 2
      ;;
    --cert-dir)
      CERT_TARGET_DIR="${2:-}"
      shift 2
      ;;
    --no-restart)
      AUTO_RESTART=0
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "未知参数：$1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${DOMAIN}" || -z "${EMAIL}" ]]; then
  echo "--domain 和 --email 为必填参数" >&2
  usage
  exit 1
fi

require_root

if ! command -v certbot >/dev/null 2>&1; then
  echo "未检测到 certbot，请先安装 certbot" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "未检测到 docker，请先安装 Docker" >&2
  exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "未找到 compose 文件：${COMPOSE_FILE}" >&2
  exit 1
fi

if [[ -f "${ROOT_DIR}/.envrc" ]]; then
  set -a
  # shellcheck disable=SC1091
  . "${ROOT_DIR}/.envrc"
  set +a
fi

if grep -q "server_name ${DOMAIN};" "${ROOT_DIR}/deploy/docker/nginx/nginx.conf"; then
  echo "检测到 nginx.conf 已包含 server_name ${DOMAIN}"
else
  echo "警告：nginx.conf 当前未发现 server_name ${DOMAIN}，请确认配置是否一致" >&2
fi

mkdir -p "${CERT_TARGET_DIR}"

echo "停止 ${SERVICE_NAME}，释放 80/443 端口..."
docker compose -f "${COMPOSE_FILE}" stop "${SERVICE_NAME}" || true

CERTBOT_ARGS=(
  certonly
  --standalone
  --keep-until-expiring
  -d "${DOMAIN}"
  --agree-tos
  -m "${EMAIL}"
  --non-interactive
)

if [[ "${FORCE_RENEWAL}" -eq 1 ]]; then
  CERTBOT_ARGS+=(--force-renewal)
fi

echo "开始申请/续期证书：${DOMAIN}"
certbot "${CERTBOT_ARGS[@]}"

LIVE_DIR="/etc/letsencrypt/live/${DOMAIN}"
FULLCHAIN_PATH="${LIVE_DIR}/fullchain.pem"
PRIVKEY_PATH="${LIVE_DIR}/privkey.pem"

if [[ ! -f "${FULLCHAIN_PATH}" || ! -f "${PRIVKEY_PATH}" ]]; then
  echo "证书申请完成，但未找到证书文件：${LIVE_DIR}" >&2
  exit 1
fi

cp "${FULLCHAIN_PATH}" "${CERT_TARGET_DIR}/domain.pem"
cp "${PRIVKEY_PATH}" "${CERT_TARGET_DIR}/domain.key"
chmod 644 "${CERT_TARGET_DIR}/domain.pem"
chmod 600 "${CERT_TARGET_DIR}/domain.key"

echo "证书已复制到：${CERT_TARGET_DIR}"

if [[ "${AUTO_RESTART}" -eq 1 ]]; then
  echo "重新启动 ${SERVICE_NAME}..."
  docker compose -f "${COMPOSE_FILE}" up -d "${SERVICE_NAME}"
fi

echo "完成。"
