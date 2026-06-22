# frontend (workspace name: "client") — pnpm workspace-aware build, served by nginx.
# Build context MUST be the repo root (see docker-compose.yml).
FROM node:20-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY catalog-service/package.json ./catalog-service/
COPY booking-service/package.json ./booking-service/
COPY frontend/package.json     ./frontend/
# Full install (build needs devDeps: vite, tailwind, etc.)
RUN pnpm install --filter client --frozen-lockfile

# VITE_* vars are baked at build time (the SPA runs in the browser and reaches
# the backends through the host-published ports, hence localhost not the
# docker-internal hostnames).
ARG VITE_CATALOG_API_URL=http://localhost:3001
ARG VITE_BOOKING_API_URL=http://localhost:3002
ENV VITE_CATALOG_API_URL=$VITE_CATALOG_API_URL
ENV VITE_BOOKING_API_URL=$VITE_BOOKING_API_URL

COPY frontend/ ./frontend/
RUN pnpm --filter client build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
