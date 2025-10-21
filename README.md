# MamiBaby - 绘本故事生成器 🎨

基于 Vite + React 18 + TypeScript + Ant Design Mobile + Vercel AI SDK 的 AI 驱动移动端绘本故事生成系统。

## 功能特性

本系统通过 AI 对话方式实现三步骤的绘本创作流程：

### 第一步：生成故事概要 📝
- 用户在聊天框输入故事提示词
- AI 生成完整的故事概要（背景、角色、情节、主题）
- 通过抽屉查看生成的概要

### 第二步：生成核心元素 🎨
- 基于故事概要，AI 生成：
  - **关键人物列表**（姓名、外貌、衣物、性格）
  - **关键物品列表**（名称、描述、特征）
  - **场景特征列表**（场景名称、环境、时间、氛围）
  - **分镜概要列表**（序号、场景描述、对话）
- 通过抽屉分类展示所有元素

### 第三步：生成分镜详情 🎬
- 基于分镜概要，AI 为每个分镜生成：
  - 详细的场景描述
  - 镜头角度建议
  - 人物动作和表情
  - 视觉元素（色调、光线、构图）
- 通过抽屉展示完整的分镜详情

## 技术栈

### 前端
- **构建工具**: Vite 5.x
- **前端框架**: React 18.x
- **编程语言**: TypeScript 5.x
- **UI 组件库**: Ant Design Mobile 5.x（移动端优化）
- **数据验证**: Zod
- **Markdown 渲染**: markdown-it

### 后端
- **运行时**: Node.js
- **Web 框架**: Express 4.x
- **认证**: JWT (jsonwebtoken)
- **AI 集成**: Vercel AI SDK + 阿里云通义千问（OpenAI 兼容模式）
- **日志**: Morgan

## 架构说明

### v2.0 前后端分离架构

**开发环境**：
- 前端开发服务器: http://localhost:3001 (Vite Dev Server)
- 后端 API 服务器: http://localhost:4000 (Express Server)
- 前端通过 Vite 代理访问后端 API

**生产环境**：
- 统一服务: http://localhost:4000 (Express Server)
- Express 同时提供静态文件服务和 API 服务

**安全特性**：
- API Key 保存在服务端，前端无法访问
- JWT Token 认证机制
- 流式响应保持用户体验

## 项目结构

```
mamibaby/
├── src/                    # 前端源码
│   ├── components/            # React组件
│   │   ├── ChatBox.tsx           # 聊天框组件
│   │   ├── DataCard.tsx          # 数据展示卡片
│   │   ├── LoginPage.tsx         # 登录页面（新增）
│   │   └── StepChat.tsx          # 步骤聊天逻辑
│   ├── services/              # 服务层
│   │   ├── apiClient.ts          # API 客户端（新增）
│   │   └── authService.ts        # 认证服务（新增）
│   ├── types/                 # TypeScript类型定义
│   │   ├── auth.ts               # 认证类型（新增）
│   │   └── story.ts              # 故事类型 + Zod schemas
│   ├── prompts/               # 提示词配置
│   │   └── storyPrompts.ts       # 三步骤提示词模板
│   ├── App.tsx                # 主应用组件
│   └── main.tsx               # 应用入口
├── server/                 # 后端源码（新增）
│   ├── config/
│   │   └── ai.ts                 # AI 配置
│   ├── middleware/
│   │   ├── auth.ts               # JWT 认证中间件
│   │   ├── errorHandler.ts       # 错误处理中间件
│   │   └── logger.ts             # 日志中间件
│   ├── routes/
│   │   ├── auth.ts               # 认证路由
│   │   └── story.ts              # 故事生成路由
│   └── index.ts               # Express 入口
├── .env                    # 环境变量（需自行创建）
├── .env.example           # 环境变量示例
├── package.json           # 项目依赖
├── tsconfig.json          # 前端 TypeScript 配置
├── tsconfig.server.json   # 后端 TypeScript 配置（新增）
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 安装和运行

### 前置要求
- Node.js 16.x 或更高版本
- pnpm（推荐）或 npm

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入实际配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 阿里云 AI 服务配置
ALICLOUD_API_KEY=your-actual-api-key-here
ALICLOUD_MODEL=qwen-turbo

# JWT 配置（建议修改为随机字符串）
JWT_SECRET=your-secret-key-change-this-in-production

# 服务端口
PORT=3000

# Node 环境
NODE_ENV=development

# 默认账号密码
DEFAULT_USERNAME=guest
DEFAULT_PASSWORD=iamguest123
```

**获取 API Key**：
1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 创建应用并获取 API Key
3. 将 API Key 填入 `.env` 文件的 `ALICLOUD_API_KEY`

**JWT Secret 生成**（可选）：
```bash
# 使用 Node.js 生成随机密钥
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 启动开发服务器

```bash
# 同时启动前后端
pnpm dev

# 或者分别启动
pnpm dev:client  # 前端: http://localhost:3001
pnpm dev:server  # 后端: http://localhost:4000
```

访问 http://localhost:3001 即可使用应用

### 4. 登录系统

首次访问需要登录：
- **默认用户名**: guest
- **默认密码**: iamguest123

可在 `.env` 文件中修改 `DEFAULT_USERNAME` 和 `DEFAULT_PASSWORD`

### 5. 构建生产版本

```bash
# 构建前后端
pnpm build

# 启动生产服务（端口 4000）
pnpm start
```

生产环境访问: http://localhost:4000

## 使用说明

### 基本流程

1. **登录**：使用默认账号 guest / iamguest123 登录
2. **第一步 - 生成故事概要**：在聊天框输入故事提示（如"一只勇敢的小兔子去森林探险"），等待 AI 生成概要
3. **查看数据**：点击右上角"查看数据"按钮，在抽屉中查看生成的内容
4. **第二步 - 生成核心元素**：点击底部"下一步"，自动触发核心元素生成
5. **第三步 - 生成分镜详情**：点击底部"下一步"，自动触发分镜详情生成
6. **退出登录**：点击右上角"退出"按钮

### 聊天交互

- 每个步骤都是独立的对话环境
- 可以随时返回上一步查看之前的内容
- 生成的数据会保留在数据抽屉中
- 支持多轮对话优化（可重新生成）
- 移动端优化的触摸交互体验

### 提示词自定义

所有 AI 提示词都在 `src/prompts/storyPrompts.ts` 中，可以根据需要自由修改：

- `STEP1_SYSTEM_PROMPT` / `STEP1_USER_PROMPT` - 第一步提示词
- `STEP2_SYSTEM_PROMPT` / `STEP2_USER_PROMPT` - 第二步提示词
- `STEP3_SYSTEM_PROMPT` / `STEP3_USER_PROMPT` - 第三步提示词

## 开发说明

### AI 集成架构

项目使用 Vercel AI SDK 的 `generateObject` 功能，配合 Zod schema 实现类型安全的结构化数据生成：

```typescript
// 定义数据结构
const schema = z.object({
  summary: z.string(),
  // ...
});

// 调用 AI 生成
const result = await generateObject({
  model: alicloud('qwen-turbo'),
  schema: schema,
  prompt: '...',
});
```

### 数据流转

```
用户输入 → StepChat → storyService → AI API
    ↓
生成结果 → 状态更新 → DataCard 展示
```

### 错误处理

- API Key 未配置：应用会显示配置提示
- 网络错误：在聊天框显示错误消息
- 数据验证失败：Zod 自动验证并报错

### 自定义模型

修改 `.env.local` 中的 `VITE_ALICLOUD_MODEL`：

- `qwen-turbo` - 快速、经济（推荐开发）
- `qwen-plus` - 平衡性能
- `qwen-max` - 最强性能

## 常见问题

### Q: 登录失败怎么办？

**A**: 
1. 确认用户名密码正确（默认 guest / iamguest123）
2. 检查后端服务是否启动（`pnpm dev:server`）
3. 查看浏览器控制台和服务端日志

### Q: API 调用失败怎么办？

**A**: 检查以下几点：
1. `.env` 文件是否正确配置 `ALICLOUD_API_KEY`
2. API Key 是否有效
3. 后端服务是否正常运行
4. Token 是否过期（尝试重新登录）
5. 查看浏览器控制台和服务端日志

### Q: Token 过期怎么办？

**A**: 
- Token 默认有效期为 7 天
- 过期后会自动跳转到登录页面
- 重新登录即可获取新的 Token

### Q: 如何修改默认账号密码？

**A**: 编辑 `.env` 文件：
```env
DEFAULT_USERNAME=your-username
DEFAULT_PASSWORD=your-password
```
重启后端服务生效

### Q: 如何更换其他 LLM 提供商？

**A**: 修改 `server/config/ai.ts`：
```typescript
import { createOpenAI } from '@ai-sdk/openai';

export const customLLM = createOpenAI({
  apiKey: process.env.YOUR_API_KEY,
  baseURL: '...', // 其他兼容 OpenAI 的端点
});
```

### Q: 生成速度慢怎么办？

**A**: 
1. 使用更快的模型（如 qwen-turbo）
2. 简化提示词
3. 检查网络连接
4. 查看服务端日志排查问题

### Q: 如何部署到生产环境？

**A**:
```bash
# 1. 构建
pnpm build

# 2. 配置生产环境变量
NODE_ENV=production

# 3. 启动服务
pnpm start
```

生产环境会在端口 4000 同时提供前端页面和 API 服务

## 更新日志

### v2.0.0 (2025-01-21)
- ✅ 前后端分离架构
- ✅ Express 后端服务
- ✅ JWT 认证系统
- ✅ API Key 服务端保护
- ✅ 流式响应保持
- ✅ 登录/登出功能
- ✅ 请求日志记录

### v1.0.0
- ✅ 基础三步骤流程
- ✅ AI 聊天对话交互
- ✅ 结构化数据生成
- ✅ 移动端 UI 适配（antd-mobile）
- ✅ 流式输出显示

## 路线图

- [ ] 数据导出功能（JSON/PDF）
- [ ] 历史记录保存
- [ ] 多用户支持
- [ ] 多语言支持
- [ ] 图片生成集成
- [ ] PC 端响应式支持

## 许可证

MIT

## 致谢

- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成框架
- [Ant Design Mobile](https://mobile.ant.design/) - 移动端 UI 组件库
- [阿里云百炼](https://bailian.console.aliyun.com/) - AI 服务提供商
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 渲染引擎
