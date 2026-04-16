FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

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
