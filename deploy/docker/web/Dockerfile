FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json

RUN pnpm install --filter web... --frozen-lockfile

COPY apps/web ./apps/web

WORKDIR /app/apps/web

RUN pnpm exec nuxt build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=builder /app/apps/web/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
