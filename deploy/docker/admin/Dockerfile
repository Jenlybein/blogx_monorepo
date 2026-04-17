# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS builder

WORKDIR /app

ARG NPM_REGISTRY=https://registry.npmmirror.com
ENV COREPACK_NPM_REGISTRY=${NPM_REGISTRY}
ENV npm_config_registry=${NPM_REGISTRY}
ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin ./apps/admin

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --filter admin... --frozen-lockfile --store-dir=/pnpm/store

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
