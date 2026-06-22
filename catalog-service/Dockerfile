# catalog-service — pnpm workspace-aware build.
# Build context MUST be the repo root (see docker-compose.yml) because pnpm needs
# the root lockfile + every workspace manifest to validate the frozen lockfile.
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Pin pnpm to the version that produced pnpm-lock.yaml
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

FROM base AS builder
WORKDIR /app
# Workspace graph: root manifests + ALL package manifests (no source yet → better cache)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY catalog-service/package.json ./catalog-service/
COPY booking-service/package.json ./booking-service/
COPY frontend/package.json     ./frontend/
# Install only this service's production deps
RUN pnpm install --filter catalog-service --frozen-lockfile --prod
# Service source
COPY catalog-service/ ./catalog-service/

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Bring over the resolved store/symlinks and the service code
COPY --from=builder /app/node_modules     ./node_modules
COPY --from=builder /app/catalog-service   ./catalog-service
WORKDIR /app/catalog-service
EXPOSE 3001
CMD ["node", "app.js"]
