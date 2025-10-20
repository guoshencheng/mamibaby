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

- **构建工具**: Vite 5.x
- **前端框架**: React 18.x
- **编程语言**: TypeScript 5.x
- **UI 组件库**: Ant Design Mobile 5.x（移动端优化）
- **AI 集成**: Vercel AI SDK + 阿里云通义千问（OpenAI 兼容模式）
- **数据验证**: Zod
- **Markdown 渲染**: markdown-it

## 项目结构

```
mamibaby/
├── src/
│   ├── components/          # React组件
│   │   ├── ChatBox.tsx         # 聊天框组件
│   │   ├── DataCard.tsx        # 数据展示卡片
│   │   └── StepChat.tsx        # 步骤聊天逻辑
│   ├── config/              # 配置文件
│   │   └── ai.ts               # AI 客户端配置
│   ├── prompts/            # 提示词配置
│   │   └── storyPrompts.ts     # 三步骤提示词模板
│   ├── services/           # 服务层
│   │   └── storyService.ts     # AI 生成服务
│   ├── types/              # TypeScript类型定义
│   │   └── story.ts            # 类型 + Zod schemas
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── vite-env.d.ts       # Vite类型声明
├── public/                 # 静态资源
├── .env.local             # 环境变量（需自行创建）
├── .env.example           # 环境变量示例
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
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

在项目根目录创建 `.env.local` 文件：

```env
# 阿里云 AI 服务配置
VITE_ALICLOUD_API_KEY=your-api-key-here
VITE_ALICLOUD_MODEL=qwen-turbo

# 可选其他模型：
# VITE_ALICLOUD_MODEL=qwen-plus
# VITE_ALICLOUD_MODEL=qwen-max
```

**关于 CORS 问题**：
- 项目默认使用 Vite 代理解决跨域问题
- API 请求通过 `/api/ai` 代理到阿里云
- API Key 在代理层添加，不会暴露到浏览器
- 如需切换直接调用模式，设置 `VITE_USE_PROXY=false`
- 详细说明请查看 [CORS-GUIDE.md](./CORS-GUIDE.md)

**获取 API Key**：
1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 创建应用并获取 API Key
3. 将 API Key 填入 `.env.local` 文件

### 3. 启动开发服务器

```bash
pnpm dev
```

应用将在 http://localhost:5173 启动

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 预览生产构建

```bash
pnpm preview
```

## 使用说明

### 基本流程

1. **配置 API Key**：在 `.env.local` 中配置阿里云 API Key
2. **启动应用**：运行 `pnpm dev`
3. **第一步**：在聊天框输入故事提示（如"一只勇敢的小兔子去森林探险"），等待 AI 生成概要
4. **查看数据**：点击右上角"查看数据"按钮，在抽屉中查看生成的内容
5. **第二步**：点击底部"下一步"，发送任意消息触发核心元素生成
6. **第三步**：点击底部"下一步"，发送任意消息触发分镜详情生成

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

### Q: API 调用失败怎么办？

**A**: 检查以下几点：
1. `.env.local` 文件是否正确配置
2. API Key 是否有效
3. 网络是否正常
4. 重启开发服务器使环境变量生效
5. 查看浏览器控制台的详细错误信息

### Q: 遇到 CORS 跨域错误怎么办？

**A**: 
1. 确认 `.env.local` 中 `VITE_USE_PROXY=true`（默认配置）
2. 重启开发服务器
3. 详细排查步骤请查看 [CORS-GUIDE.md](./CORS-GUIDE.md)

### Q: 如何更换其他 LLM 提供商？

**A**: 修改 `src/config/ai.ts`：

```typescript
import { createOpenAI } from '@ai-sdk/openai';

export const customLLM = createOpenAI({
  apiKey: '...',
  baseURL: '...', // 其他兼容 OpenAI 的端点
});
```

### Q: 生成速度慢怎么办？

**A**: 
1. 使用更快的模型（如 qwen-turbo）
2. 简化提示词
3. 检查网络连接

### Q: 如何导出生成的数据？

**A**: 当前版本暂不支持导出，可以手动复制右侧卡片的内容。后续版本会添加 JSON/PDF 导出功能。

## 路线图

- [x] 基础三步骤流程
- [x] AI 聊天对话交互
- [x] 结构化数据生成
- [x] 移动端 UI 适配（antd-mobile）
- [x] 流式输出显示
- [ ] 数据导出功能（JSON/PDF）
- [ ] 历史记录保存
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
