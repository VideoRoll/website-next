# Console 项目 SSR → CSR 改造总结

## 改造概述

将 Next.js console 项目从「以 SSR 为主」改造成「以客户端渲染（SPA）为主」的架构。

## 主要改造点

### 1. i18n 改造

#### 新增文件
- `contexts/I18nContext.tsx` - 客户端 i18n Provider，替代 next-intl 的路由级 i18n

#### 改造内容
- ✅ 移除路由级 i18n（不再使用 `/en`、`/zh` 等 locale 路由）
- ✅ 改为纯客户端方案（使用 Context + localStorage + cookie）
- ✅ 保留现有文案 key、翻译文件结构（`messages/zh.json`、`messages/en.json`）
- ✅ 兼容 next-intl 的 `useTranslations`、`useLocale` API

#### 使用方式
```tsx
import { useTranslations, useLocale } from "@/contexts/I18nContext";

const t = useTranslations("dashboard.navigation");
const locale = useLocale();
```

### 2. 路由结构改造

#### 移除的文件/目录
- `app/[locale]/` - 整个 locale 路由段已移除
- `app/[locale]/(dashboard)/` - 已迁移到 `app/dashboard/`
- `app/[locale]/tools/` - 已迁移到 `app/tools/`

#### 新的路由结构
```
app/
├── layout.tsx              # 根布局（服务端，仅 HTML 结构）
├── page.tsx                # 首页（客户端，重定向到 /dashboard/profile）
├── providers.tsx           # 客户端 Providers（I18n + Theme + User）
├── dashboard/
│   ├── layout.tsx          # Dashboard 布局（客户端）
│   ├── page.tsx            # Dashboard 首页（重定向）
│   ├── profile/
│   ├── account/
│   ├── subscription/
│   └── about/
└── tools/
    ├── layout.tsx          # Tools 布局（客户端）
    ├── page.tsx
    └── convert/
```

### 3. 认证改造

#### 新增文件
- `app/api/auth/user/route.ts` - 服务端认证 API route

#### 改造内容
- ✅ 保留服务端认证逻辑（`getUserServerSideProps` 封装为 API route）
- ✅ `UserContext` 支持从 API 获取用户信息
- ✅ 添加 `isLoading` 状态和 `refreshUser` 方法

#### 使用方式
```tsx
import { useUser } from "@/contexts/UserContext";

const { currentUser, isLoading, refreshUser } = useUser();
```

### 4. 组件改造

#### 需要 `use client` 的组件
- ✅ 所有页面组件（`app/**/page.tsx`）
- ✅ 所有 Layout 组件（`app/**/layout.tsx`，除根 layout）
- ✅ 所有业务组件（`components/dashboard/**`、`components/layout/**`）

#### 必须保留在服务端的组件
- ✅ `app/layout.tsx` - 根布局（仅 HTML 结构）
- ✅ `app/api/**/route.ts` - API routes（服务端）

### 5. 路由导航改造

#### 更新内容
- ✅ 所有 `@/i18n/navigation` 的引用改为 `next/navigation`
- ✅ `LinkButton` 组件改为使用 `next/link`
- ✅ 所有路由跳转使用客户端路由（`next/navigation`）

#### 路由路径变更
- `/profile` → `/dashboard/profile`
- `/account` → `/dashboard/account`
- `/subscription` → `/dashboard/subscription`
- `/about` → `/dashboard/about`
- `/tools` → `/tools`（保持不变）

### 6. Loading/Skeleton UI

#### 新增文件
- `components/ui/skeleton.tsx` - Skeleton 组件

#### 改造内容
- ✅ `UserContext` 添加 `isLoading` 状态
- ✅ `DashboardLayout` 添加加载状态 UI
- ✅ `ProfileContent`、`AccountContent`、`SubscriptionContent` 添加 Skeleton

### 7. 配置文件更新

#### `next.config.mjs`
- ✅ 移除 `next-intl/plugin`
- ✅ 移除 `withNextIntl` 包装

## 改造后的架构特点

1. **纯客户端渲染**：所有页面和业务组件均为客户端组件
2. **客户端 i18n**：使用 Context + localStorage，不依赖路由
3. **服务端认证**：仅认证相关逻辑保留在服务端（API route）
4. **扁平化路由**：移除 locale 路由段，路由更简洁
5. **加载体验**：所有数据加载过程都有 Skeleton/Loading UI

## 注意事项

1. **basePath**：项目仍使用 `/console` basePath，所有路由会自动添加此前缀
2. **翻译文件**：保持现有结构，无需重写文案
3. **兼容性**：`useTranslations`、`useLocale` API 保持兼容，迁移成本低
4. **认证**：用户信息通过 API 获取，首次加载可能有短暂延迟

## 迁移检查清单

- [x] 创建客户端 i18n Provider
- [x] 改造路由结构（移除 [locale]）
- [x] 创建服务端认证 API route
- [x] 改造所有 Layout 组件为客户端组件
- [x] 改造所有页面组件为客户端组件
- [x] 更新导航和路由跳转逻辑
- [x] 添加数据加载的 Skeleton/Loading UI
- [x] 更新 next.config.mjs 移除 i18n 相关配置

## 后续优化建议

1. 考虑添加语言切换 UI（使用 `I18nContext` 的 `setLocale`）
2. 优化用户信息获取的缓存策略
3. 考虑添加路由级别的 Loading 状态
4. 考虑添加错误边界（Error Boundary）
