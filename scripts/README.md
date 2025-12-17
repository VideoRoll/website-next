# 📜 构建脚本说明

本目录包含用于构建和管理 Docker 镜像的脚本。

## 🚀 快速开始

### Windows 用户（推荐）

```powershell
# 快速构建（使用 BuildKit 缓存优化）
.\scripts\docker-build-fast.ps1

# 指定标签
.\scripts\docker-build-fast.ps1 -Tag "v1.0.0"

# 不使用缓存重新构建
.\scripts\docker-build-fast.ps1 -NoCache
```

### Linux/macOS 用户

```bash
# 快速构建
bash scripts/docker-build-fast.sh

# 指定标签
bash scripts/docker-build-fast.sh v1.0.0

# 标准构建（带交互）
bash scripts/docker-build.sh
```

## 📂 脚本列表

### 🚀 docker-build-fast.ps1 / docker-build-fast.sh

**快速构建脚本** - 专注于速度，使用 BuildKit 缓存

**特性:**
- ✅ 自动启用 BuildKit
- ✅ 优先使用 `Dockerfile.optimized`
- ✅ 显示构建时间统计
- ✅ 显示镜像信息
- ✅ 支持自定义标签

**使用场景:**
- 本地开发快速迭代
- 测试 Docker 构建
- 需要频繁重新构建

**参数:**
- `Tag` / `$1`: 镜像标签（默认: latest）
- `-NoCache`: 不使用缓存（PowerShell）

### 🛠️ docker-build.sh

**完整构建脚本** - 功能丰富，带交互式选项

**特性:**
- ✅ 构建完成后显示镜像信息
- ✅ 可选推送到镜像仓库
- ✅ 可选本地测试运行
- ✅ 健康检查验证
- ✅ 交互式确认

**使用场景:**
- 生产环境构建
- 需要推送到仓库
- 构建后立即测试

**参数:**
- `$1`: 镜像标签（默认: latest）
- 环境变量 `DOCKER_REGISTRY`: 镜像仓库地址

### 🧹 clean_logs.sh

**日志清理脚本** - 清理项目中的日志文件

**特性:**
- 清理 `.log` 文件
- 清理 `logs` 目录
- 显示清理统计

## 📊 构建时间对比

| 脚本 | 首次构建 | 后续构建（改依赖） | 后续构建（仅改代码） |
|------|----------|-------------------|---------------------|
| docker-build-fast | 10-15 分钟 | 2-5 分钟 | 1-2 分钟 |
| docker-build | 10-15 分钟 | 5-10 分钟 | 2-3 分钟 |

## 💡 使用建议

### 日常开发
```powershell
# Windows
.\scripts\docker-build-fast.ps1

# Linux/macOS
bash scripts/docker-build-fast.sh
```

### 准备发布
```bash
# 使用完整脚本，推送到仓库
DOCKER_REGISTRY=registry.example.com bash scripts/docker-build.sh v1.0.0
```

### 测试验证
```bash
# 构建并自动运行容器测试
bash scripts/docker-build.sh latest
# 脚本会询问是否运行容器进行测试
```

## 🔧 环境要求

- Docker Desktop 已安装并运行
- BuildKit 支持（Docker 18.09+）
- Windows: PowerShell 5.0+
- Linux/macOS: Bash 4.0+

## 🐛 故障排查

### PowerShell 脚本执行策略错误

```powershell
# 临时允许执行脚本
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 然后运行脚本
.\scripts\docker-build-fast.ps1
```

### Bash 脚本权限错误

```bash
# 添加执行权限
chmod +x scripts/*.sh

# 运行脚本
bash scripts/docker-build-fast.sh
```

### Docker 未运行

确保 Docker Desktop 已启动：
- Windows: 检查系统托盘图标
- Linux: `sudo systemctl status docker`
- macOS: 检查菜单栏图标

## 📚 相关文档

- [DOCKER_BUILD_GUIDE.md](../DOCKER_BUILD_GUIDE.md) - 构建快速指南
- [DOCKER_DEPLOYMENT.md](../DOCKER_DEPLOYMENT.md) - 完整部署文档
- [Dockerfile](../Dockerfile) - 标准 Dockerfile
- [Dockerfile.optimized](../Dockerfile.optimized) - 优化版 Dockerfile

## 🤝 贡献

如果你有改进建议或发现问题，欢迎提 PR 或 Issue！
