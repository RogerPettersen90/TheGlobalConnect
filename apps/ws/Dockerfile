FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/ws/package.json ./apps/ws/

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm@8

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN pnpm --filter=@theglobalconnect/db db:generate

# Build the app
RUN pnpm --filter=@theglobalconnect/ws build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 wsuser

# Copy built application
COPY --from=builder --chown=wsuser:nodejs /app/apps/ws/dist ./apps/ws/dist
COPY --from=builder --chown=wsuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=wsuser:nodejs /app/packages ./packages

USER wsuser

EXPOSE 3001

ENV PORT 3001

CMD ["node", "apps/ws/dist/index.js"]