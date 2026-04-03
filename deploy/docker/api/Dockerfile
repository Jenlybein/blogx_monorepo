# 阶段 1：基于官方 golang:alpine 镜像创建构建环境
FROM golang:alpine AS builder

# 禁用 CGO，生成静态可执行文件
ENV CGO_ENABLED=0

# 配置国内镜像，加速依赖下载
ENV GOPROXY=https://goproxy.cn,direct

# 修改 alpine 软件源，加速 apk 安装
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 先复制 go mod 文件，利用 Docker layer cache 加速依赖下载
WORKDIR /build/apps/api
COPY apps/api/go.mod apps/api/go.sum ./
RUN go mod download

# 再复制应用源码并编译服务入口
COPY apps/api ./
RUN go build -o /build/out/server ./cmd/server

# 阶段 2：基于极简 alpine 镜像创建运行环境
FROM alpine

# 设置运行时工作目录
WORKDIR /app

# 拷贝编译产物和应用默认资源
COPY --from=builder /build/out/server /app/server
COPY --from=builder /build/apps/api/config /app/config
COPY --from=builder /build/apps/api/resources /app/resources

# 安装运行时依赖：时区、CA 证书、mysql 客户端（包含 mysqldump）
RUN apk add --no-cache tzdata ca-certificates mysql-client && update-ca-certificates

# 预创建运行时目录，便于卷挂载和 river 位点持久化
RUN printf '%s\n' \
	'#!/bin/sh' \
	'set -eu' \
	'' \
	'if command -v mariadb-dump >/dev/null 2>&1; then' \
	'	exec "$(command -v mariadb-dump)" --skip-ssl-verify-server-cert "$@"' \
	'fi' \
	'' \
	'exec "$(command -v mysqldump)" --skip-ssl-verify-server-cert "$@"' \
	> /usr/local/bin/mariadb-dump-wrapper \
	&& chmod +x /usr/local/bin/mariadb-dump-wrapper \
	&& mkdir -p /app/logs /app/uploads /app/var

# 容器启动时执行服务进程
CMD ["./server"]
