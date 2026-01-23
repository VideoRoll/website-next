# syntax=docker/dockerfile:1.4
ARG PROJECT=console

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
RUN npm install turbo --global

# --- 阶段 1: Prune (提取子集) ---
FROM base AS pruner
ARG PROJECT

WORKDIR /app

# RUN npm install -g turbo
COPY . .
# 使用 turbo prune 提取 console 及其依赖包的最小集合
RUN pnpm dlx turbo prune @website-next/${PROJECT} --docker 
# 临时添加这一行，构建时看一眼控制台输出的目录结构
# RUN ls -R /app/out

# --- 阶段 2: 依赖安装 ---
FROM base AS deps

WORKDIR /app
# 只复制 lockfile 和 prune 出来的 package.json
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
COPY .npmrc ./ 

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

# --- 阶段 3: 源码构建 ---
FROM base AS builder
ARG PROJECT
WORKDIR /app

# 复制一个package.json到根目录
# COPY --from=pruner /app/out/json/apps/${PROJECT}/package.json ./package.json
# # 删除node_modules
# RUN rm -rf node_modules
# RUN pnpm install --prod
# COPY turbo.json ./

COPY --from=deps /app ./

# 2. 【关键】在 builder 阶段重新 install
# 因为使用了相同的 id=pnpm 缓存挂载，这一步不会重新下载，
# 它只会根据当前阶段的文件系统重新建立正确的 node_modules 结构和软链接。
# RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
#     pnpm install --frozen-lockfile

ENV NODE_ENV=production
# 运行构建
RUN pnpm turbo run build --filter=@website-next/${PROJECT}

# --- 阶段 4: 运行 ---
FROM node:20-alpine AS runner
ARG PROJECT
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV PORT=3134

# standalone 模式会自动把依赖抽离到这个文件夹
COPY --from=builder --chown=nextjs:nodejs /app/apps/${PROJECT}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${PROJECT}/.next/static ./apps/${PROJECT}/.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/apps/console/public ./apps/console/public

USER nextjs
EXPOSE 3134

# 注意：standalone 模式下的启动路径
CMD ["node", "apps/console/server.js"]