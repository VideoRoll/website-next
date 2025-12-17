#!/bin/bash

# Docker 快速构建脚本（使用 BuildKit 缓存优化）
# 用法: ./scripts/docker-build-fast.sh [tag]

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 配置
IMAGE_NAME="website-next"
IMAGE_TAG=${1:-latest}
USE_OPTIMIZED=${USE_OPTIMIZED:-true}

echo -e "${BLUE}🚀 快速构建模式 (使用 BuildKit 缓存)${NC}"
echo -e "${BLUE}镜像名称: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo ""

# 检查是否在项目根目录
if [ ! -f "Dockerfile" ]; then
    echo -e "${RED}❌ 错误: 在项目根目录未找到 Dockerfile${NC}"
    exit 1
fi

# 启用 Docker BuildKit
export DOCKER_BUILDKIT=1

# 选择 Dockerfile
DOCKERFILE_PATH="Dockerfile"
if [ "$USE_OPTIMIZED" = "true" ] && [ -f "Dockerfile.optimized" ]; then
    DOCKERFILE_PATH="Dockerfile.optimized"
    echo -e "${GREEN}✨ 使用优化版 Dockerfile (带缓存挂载)${NC}"
else
    echo -e "${YELLOW}⚠️  使用标准 Dockerfile${NC}"
fi

# 显示构建信息
echo -e "${BLUE}📦 开始构建...${NC}"
echo ""

# 记录开始时间
START_TIME=$(date +%s)

# 构建镜像
docker build \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --progress=plain \
    -t ${IMAGE_NAME}:${IMAGE_TAG} \
    -f ${DOCKERFILE_PATH} \
    .

BUILD_EXIT_CODE=$?

# 记录结束时间
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ 镜像构建成功!${NC}"
    echo -e "${GREEN}⏱️  构建耗时: ${MINUTES}分${SECONDS}秒${NC}"
    echo ""
    
    # 显示镜像信息
    echo -e "${BLUE}📊 镜像信息:${NC}"
    docker images ${IMAGE_NAME}:${IMAGE_TAG} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo ""
    echo -e "${YELLOW}💡 提示:${NC}"
    echo -e "${YELLOW}   - 后续构建会更快，因为会复用缓存${NC}"
    echo -e "${YELLOW}   - 运行容器: docker run -p 3001:3001 ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
    echo -e "${YELLOW}   - 使用 docker-compose: docker-compose up${NC}"
else
    echo -e "${RED}❌ 镜像构建失败 (耗时: ${MINUTES}分${SECONDS}秒)${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 完成!${NC}"
