#!/bin/bash

# MamiBaby 快速部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署 MamiBaby..."

# 检查是否安装了 PM2
if ! command -v pm2 &> /dev/null; then
    echo "❌ 错误: PM2 未安装"
    echo "请运行: npm install -g pm2"
    exit 1
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  警告: .env 文件不存在"
    echo "正在从 .env.example 复制..."
    cp .env.example .env
    echo "✅ 请编辑 .env 文件并填入正确的配置"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm build

# 检查 PM2 进程是否已存在
if pm2 list | grep -q "mamibaby"; then
    echo "🔄 重新加载应用（0停机）..."
    pm2 reload mamibaby
else
    echo "🆕 首次启动应用..."
    pm2 start ecosystem.config.js --env production
fi

# 保存 PM2 进程列表
pm2 save

echo ""
echo "✅ 部署完成！"
echo ""
echo "📊 应用状态:"
pm2 list
echo ""
echo "📝 查看日志: pnpm pm2:logs"
echo "📊 监控面板: pnpm pm2:monit"
echo "🌐 访问地址: http://localhost:4000"
echo ""

