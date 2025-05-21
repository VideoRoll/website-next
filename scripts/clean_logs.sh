#!/bin/bash

# Docker 日志目录（默认）
LOG_DIR="/var/lib/docker/containers"
MAX_SIZE_MB=10     # 设置为 0 表示清理全部
ARCHIVE=false      # true 表示压缩备份日志，false 表示直接清空

echo "🧹 Docker 日志清理开始..."
echo "清理日志大于 ${MAX_SIZE_MB}MB 的文件..."

# 遍历并清理日志
find "$LOG_DIR" -type f -name "*-json.log" | while read -r log_file; do
    size_bytes=$(stat -c %s "$log_file")
    size_mb=$((size_bytes / 1024 / 1024))

    if [ "$MAX_SIZE_MB" -eq 0 ] || [ "$size_mb" -ge "$MAX_SIZE_MB" ]; then
        echo "🗑️ 清理: $log_file (${size_mb}MB)"
        if [ "$ARCHIVE" = true ]; then
            gzip "$log_file"
        else
            cat /dev/null > "$log_file"
        fi
    else
        echo "✅ 保留: $log_file (${size_mb}MB)"
    fi
done

echo "✅ Docker 日志清理完成"
