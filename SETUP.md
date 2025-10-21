# MamiBaby 快速设置指南

## 第一步：配置 API Key

1. 打开项目根目录的 `.env` 文件
2. 将 `ALICLOUD_API_KEY` 的值替换为您的实际 API Key：

```env
ALICLOUD_API_KEY=sk-your-actual-api-key-here
```

> **提示**: 如果您还没有 API Key，请访问 [阿里云百炼平台](https://bailian.console.aliyun.com/) 获取。

## 第二步：启动开发服务器

```bash
pnpm dev
```

这个命令会同时启动：
- 前端开发服务器: http://localhost:3001
- 后端 API 服务器: http://localhost:4000

## 第三步：登录使用

1. 打开浏览器访问 http://localhost:3001
2. 使用默认账号登录：
   - 用户名: `guest`
   - 密码: `iamguest123`
3. 开始创作您的绘本故事！

## 故障排查

### 后端启动失败

```bash
# 检查端口 3000 是否被占用
lsof -ti:3000

# 如果被占用，可以在 .env 中修改端口
PORT=3002
```

### 前端启动失败

```bash
# 检查端口 3001 是否被占用
lsof -ti:3001

# 如果被占用，可以修改 vite.config.ts 中的端口
```

### API 调用失败

1. 确认 `.env` 文件中的 `ALICLOUD_API_KEY` 已正确配置
2. 检查后端服务是否正常运行（查看控制台日志）
3. 确认网络连接正常
4. 查看浏览器开发者工具的 Network 标签页

## 生产环境部署

```bash
# 1. 构建
pnpm build

# 2. 设置环境变量
export NODE_ENV=production

# 3. 启动服务
pnpm start
```

访问 http://localhost:4000

---

**需要帮助？** 请查看 [README.md](./README.md) 的常见问题部分。
