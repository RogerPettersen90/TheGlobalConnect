FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm --filter=@theglobalconnect/db db:generate

# Build the web application
RUN pnpm --filter=@theglobalconnect/web build

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["pnpm", "start"]