# syntax = docker/dockerfile:experimental

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest-9 --activate

# Copy manifest files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./

# Copy shared packages
COPY packages/ ./packages/

# Copy the docs app
COPY apps/docs/ ./apps/docs/

# Install dependencies (only what's needed for the workspace)
RUN pnpm install --frozen-lockfile

# Build the app
WORKDIR /app/apps/docs
RUN pnpm run build

# Final stage
FROM node:${NODE_VERSION}-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built outputs
COPY --from=builder /app/apps/docs/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
