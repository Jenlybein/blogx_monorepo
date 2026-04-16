FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

ARG BLOGX_ADMIN_ENV_PROFILE=production
ARG BLOGX_ADMIN_SITE_URL=https://blogx.gentlybeing.cn/admin
ARG BLOGX_ADMIN_WEB_SITE_URL=https://blogx.gentlybeing.cn
ARG BLOGX_ADMIN_API_UPSTREAM=http://blogx_server:8080
ARG BLOGX_ADMIN_BASE_URL=/admin/

ENV BLOGX_ADMIN_ENV_PROFILE=${BLOGX_ADMIN_ENV_PROFILE}
ENV BLOGX_ADMIN_SITE_URL=${BLOGX_ADMIN_SITE_URL}
ENV BLOGX_ADMIN_WEB_SITE_URL=${BLOGX_ADMIN_WEB_SITE_URL}
ENV BLOGX_ADMIN_API_UPSTREAM=${BLOGX_ADMIN_API_UPSTREAM}
ENV BLOGX_ADMIN_BASE_URL=${BLOGX_ADMIN_BASE_URL}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin ./apps/admin

RUN pnpm install --filter admin... --frozen-lockfile

WORKDIR /app/apps/admin

RUN pnpm exec nuxt build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3001

COPY --from=builder /app/apps/admin/.output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
