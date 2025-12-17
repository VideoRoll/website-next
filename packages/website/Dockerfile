# syntax=docker/dockerfile:1.4
# 使用 BuildKit 语法以支持缓存挂载和构建密钥

# 阶段 1: 依赖安装
FROM node:20-alpine AS deps

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# 复制 workspace 配置文件（从 monorepo 根目录）
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./

# 复制所有 package.json 文件以利用缓存
COPY packages/website/package.json ./packages/website/package.json

# 使用 BuildKit 缓存挂载，大幅提升构建速度
# 这样 pnpm store 会在多次构建之间保持
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# 阶段 2: 构建应用
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/website/node_modules ./packages/website/node_modules

# 复制源代码
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 使用构建密钥注入环境变量并构建
RUN --mount=type=secret,id=supabase_url \
    --mount=type=secret,id=supabase_anon_key \
    export NEXT_PUBLIC_SUPABASE_URL=$(cat /run/secrets/supabase_url) && \
    export NEXT_PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/supabase_anon_key) && \
    pnpm -F @website-next/website build

# 阶段 3: 运行时
FROM node:20-alpine AS runner

WORKDIR /app

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# 复制必要的文件
COPY --from=builder /app/packages/website/next.config.mjs ./packages/website/
COPY --from=builder /app/packages/website/package.json ./packages/website/

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/packages/website/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/website/.next/static ./packages/website/.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# 启动应用
CMD ["node", "packages/website/server.js"]
