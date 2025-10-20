#!/bin/bash

echo "开始安装 MamiBaby 项目依赖..."

# 检查是否存在npm权限问题
if [ ! -w ~/.npm ]; then
    echo "检测到 npm 缓存权限问题，正在修复..."
    sudo chown -R $(whoami) ~/.npm
fi

# 安装依赖
echo "正在安装项目依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功！"
    echo ""
    echo "运行以下命令启动开发服务器："
    echo "  npm run dev"
else
    echo "❌ 依赖安装失败，请检查错误信息"
    exit 1
fi

