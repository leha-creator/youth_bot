# syntax=docker/dockerfile:1

# --- Dependencies (production only) ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# --- Builder ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci 2>/dev/null || npm install
COPY . .
RUN npm run build

# --- Production ---
FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S appuser && \
    adduser -S -u 1001 -G appuser appuser
COPY --from=deps --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
COPY --chown=appuser:appuser package.json ./
RUN mkdir -p /app/data && chown appuser:appuser /app/data
USER appuser
CMD ["node", "dist/app.js"]
