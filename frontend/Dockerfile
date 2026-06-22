# --- Build stage ---
FROM node:20-alpine AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Install dependencies (cached unless manifests change)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the static site
COPY . .
RUN pnpm build

# --- Serve stage ---
FROM nginx:1.27-alpine AS serve

# SPA routing: fall back to index.html for client-side routes
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
