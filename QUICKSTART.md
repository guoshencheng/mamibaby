# 快速启动指南 🚀

## 第一次使用必读

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 API Key（重要！）

在项目根目录创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local
```

然后编辑 `.env.local`，填入您的阿里云 API Key：

```env
VITE_ALICLOUD_API_KEY=sk-your-actual-api-key-here
VITE_ALICLOUD_MODEL=qwen-turbo
VITE_USE_PROXY=true
```

**注意**：默认使用代理模式解决 CORS 跨域问题，无需配置 BASE_URL。

**如何获取 API Key？**

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 注册/登录账号
3. 创建应用
4. 获取 API Key
5. 复制到 `.env.local` 文件

### 3. 启动开发服务器

```bash
pnpm dev
```

浏览器会自动打开 http://localhost:5173

## 使用流程

### 第一步：生成故事概要

1. 在聊天框输入故事提示，例如：
   ```
   一只勇敢的小兔子想要去森林深处寻找传说中的魔法胡萝卜
   ```

2. 等待 AI 生成故事概要（约 5-10 秒）

3. 查看右侧卡片的概要内容

4. 点击"下一步"

### 第二步：生成核心元素

1. 在聊天框输入任意内容（如"开始生成"）触发生成

2. AI 会生成：
   - 关键人物（外貌、衣物、性格）
   - 关键物品
   - 场景特征
   - 分镜概要

3. 在右侧卡片查看详细信息

4. 点击"下一步"

### 第三步：生成分镜详情

1. 在聊天框输入任意内容触发生成

2. AI 会为每个分镜生成详细描述：
   - 详细场景描述
   - 镜头角度
   - 人物动作
   - 视觉元素

3. 在右侧卡片查看完整信息

4. 完成！🎉

## 常见问题

### ❌ 提示"请配置 VITE_ALICLOUD_API_KEY"

**原因**：环境变量未配置或未生效

**解决**：
1. 确认 `.env.local` 文件在项目根目录
2. 确认 API Key 正确填写
3. **重启开发服务器**（Ctrl+C 停止，然后重新运行 `pnpm dev`）

### ❌ CORS 跨域错误

**错误信息**：
```
Access to fetch ... has been blocked by CORS policy
```

**解决方案**：
1. 确认 `.env.local` 中设置了 `VITE_USE_PROXY=true`（这是默认值）
2. 重启开发服务器
3. 如果仍有问题，查看详细排查指南：[CORS-GUIDE.md](./CORS-GUIDE.md)

### ❌ 生成失败

**可能原因**：
- 网络连接问题
- API Key 无效或过期
- API 配额用尽

**解决**：
1. 检查网络连接
2. 在阿里云控制台验证 API Key
3. 查看控制台错误信息（F12 → Console）

### ⚠️ 生成速度慢

**优化建议**：
1. 使用 `qwen-turbo` 模型（最快）
2. 检查网络速度
3. 考虑使用其他地区的 API 端点

## 提示词优化建议

### 第一步提示词示例（效果更好）

```
一只名叫小白的兔子，住在森林边缘的小木屋里。
有一天，它听说森林深处有一个神奇的花园，里面长满了能实现愿望的胡萝卜。
小白决定踏上冒险之旅。
```

### 提示词技巧

- ✅ 包含主角名字和特征
- ✅ 描述故事背景和场景
- ✅ 说明故事的冲突或目标
- ✅ 适合儿童阅读（3-8岁）
- ❌ 避免过于复杂的情节
- ❌ 避免暴力或恐怖内容

## 自定义配置

### 切换模型

编辑 `.env.local`：

```env
# 经济模式（快速，便宜）
VITE_ALICLOUD_MODEL=qwen-turbo

# 平衡模式
VITE_ALICLOUD_MODEL=qwen-plus

# 高质量模式（慢，贵）
VITE_ALICLOUD_MODEL=qwen-max
```

### 修改提示词

编辑 `src/prompts/storyPrompts.ts`，可以自定义：
- 故事风格
- 目标年龄段
- 内容要求
- 输出格式

## 项目命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview

# 类型检查
pnpm exec tsc --noEmit
```

## 需要帮助？

- 查看完整文档：`README.md`
- 查看代码注释：所有核心文件都有详细注释
- 查看控制台日志：F12 → Console

---

**祝您创作愉快！** 🎨✨
