# 🚀 Docker 快速开始

## 📝 前置步骤

1. 确保 Docker Desktop 已安装并运行
2. 在当前目录（`packages/website/`）创建 `.env.local` 文件

## ⚡ 快速命令

### Windows (Git Bash)

```bash
# 一键构建并运行
export $(cat .env.local | grep -v '^#' | xargs) && docker-compose build && docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### Windows (PowerShell)

```powershell
# 加载环境变量并构建
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^([^#].+?)=(.+)$') {
        [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
    }
}
docker-compose build
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### Linux/macOS

```bash
# 一键构建并运行
export $(grep -v '^#' .env.local | xargs) && docker-compose build && docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

## 🔍 验证

```bash
# 检查容器状态
docker-compose ps

# 访问应用
curl http://localhost:3001

# 健康检查
curl http://localhost:3001/api/health

# 查看环境变量
docker-compose exec website env | grep SUPABASE
```

## 📂 从根目录运行

```bash
# 使用 -f 参数指定 compose 文件
cd ../..  # 回到根目录
export $(grep -v '^#' packages/website/.env.local | xargs)
docker-compose -f packages/website/docker-compose.yml build
docker-compose -f packages/website/docker-compose.yml up -d
```

## ⚠️ 常见问题

### 环境变量未生效

确保在构建前先 export：
```bash
export $(grep -v '^#' .env.local | xargs)
echo $NEXT_PUBLIC_SUPABASE_URL  # 验证
docker-compose build --no-cache
```

### 端口被占用

修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "8080:3001"  # 改为 8080
```

### 需要重新构建

```bash
# 不使用缓存重新构建
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

## 🎯 下一步

- 查看 [DOCKER_README.md](./DOCKER_README.md) 了解详细说明
- 查看 [../../DOCKER_DEPLOYMENT.md](../../DOCKER_DEPLOYMENT.md) 了解部署指南
