# booking-service — pnpm workspace-aware build.
# Build context MUST be the repo root (see docker-compose.yml).
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY catalog-service/package.json ./catalog-service/
COPY booking-service/package.json ./booking-service/
COPY frontend/package.json     ./frontend/
RUN pnpm install --filter booking-service --frozen-lockfile --prod
COPY booking-service/ ./booking-service/

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/booking-service   ./booking-service
WORKDIR /app/booking-service
EXPOSE 3002
CMD ["node", "app.js"]
