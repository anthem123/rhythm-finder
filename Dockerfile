# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

# ---- Dependencies ----
FROM node:${NODE_VERSION} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build (outputs static files to /app/out) ----
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime: nginx serving the static export ----
FROM nginx:alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Must match basePath in next.config
ARG BASE_PATH=rhythm-finder
COPY --from=builder /app/out /usr/share/nginx/html/${BASE_PATH}
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]