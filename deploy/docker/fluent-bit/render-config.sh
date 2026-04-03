#!/bin/sh
set -eu

: "${BLOGX_CLICKHOUSE_DB:?BLOGX_CLICKHOUSE_DB 未设置}"
: "${BLOGX_CLICKHOUSE_USERNAME:?BLOGX_CLICKHOUSE_USERNAME 未设置}"
: "${BLOGX_CLICKHOUSE_PASSWORD:?BLOGX_CLICKHOUSE_PASSWORD 未设置}"

escape_sed_replacement() {
  printf '%s' "$1" | sed -e 's/[\/&\\]/\\&/g'
}

clickhouse_db_escaped="$(escape_sed_replacement "${BLOGX_CLICKHOUSE_DB}")"
clickhouse_username_escaped="$(escape_sed_replacement "${BLOGX_CLICKHOUSE_USERNAME}")"
clickhouse_password_escaped="$(escape_sed_replacement "${BLOGX_CLICKHOUSE_PASSWORD}")"

sed \
  -e "s/__BLOGX_CLICKHOUSE_DB__/${clickhouse_db_escaped}/g" \
  -e "s/__BLOGX_CLICKHOUSE_USERNAME__/${clickhouse_username_escaped}/g" \
  -e "s/__BLOGX_CLICKHOUSE_PASSWORD__/${clickhouse_password_escaped}/g" \
  /fluent-bit/etc/fluent-bit.conf.tmpl > /tmp/fluent-bit.conf

exec /fluent-bit/bin/fluent-bit -c /tmp/fluent-bit.conf
