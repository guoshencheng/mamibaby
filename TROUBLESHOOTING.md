# 问题排查指南

## 当前问题：代理未生效

### 问题现象

终端显示：
```
[Proxy] POST /compatible-mode/v1/responses -> /compatible-mode/v1/responses
[Proxy] Response: 404 for /compatible-mode/v1/responses
```

### 问题分析

**关键点**：请求路径是 `/compatible-mode/v1/responses` 而不是 `/api/ai/...`

这说明：
1. ❌ 前端没有使用 `/api/ai` 作为 baseURL
2. ❌ 可能是环境变量配置错误
3. ❌ 或者 `.env.local` 中设置了错误的 `VITE_ALICLOUD_BASE_URL`

### 排查步骤

#### 1. 检查 .env.local 文件

**正确的配置应该是**：
```env
VITE_ALICLOUD_API_KEY=your-api-key
VITE_ALICLOUD_MODEL=qwen-turbo
# 不要设置 VITE_USE_PROXY=false
# 不要设置 VITE_ALICLOUD_BASE_URL=/compatible-mode/v1
```

**错误的配置（需要修复）**：
```env
❌ VITE_USE_PROXY=false
❌ VITE_ALICLOUD_BASE_URL=/compatible-mode/v1
❌ VITE_ALICLOUD_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

#### 2. 查看浏览器控制台

刷新页面后，在浏览器控制台（F12 → Console）应该看到：

**期望的输出**：
```
=== AI 配置信息 ===
VITE_USE_PROXY: undefined (或 true)
useProxy: true
VITE_ALICLOUD_BASE_URL: undefined
VITE_ALICLOUD_API_KEY: 已配置
VITE_ALICLOUD_MODEL: qwen-turbo
最终 baseURL: /api/ai
==================
```

**如果看到错误的配置**：
```
❌ VITE_USE_PROXY: false
❌ useProxy: false
❌ VITE_ALICLOUD_BASE_URL: /compatible-mode/v1
❌ 最终 baseURL: /compatible-mode/v1
```

说明环境变量配置错误！

#### 3. 修复步骤

**步骤 1**：编辑 `.env.local` 文件

删除或注释掉错误的配置：
```env
# 删除或注释这些行
# VITE_USE_PROXY=false
# VITE_ALICLOUD_BASE_URL=/compatible-mode/v1
```

保留正确的配置：
```env
VITE_ALICLOUD_API_KEY=your-actual-api-key
VITE_ALICLOUD_MODEL=qwen-turbo
```

**步骤 2**：重启开发服务器

```bash
# 按 Ctrl+C 停止
# 然后重新启动
pnpm dev
```

**步骤 3**：验证修复

刷新浏览器，在控制台应该看到：
```
=== AI 配置信息 ===
...
useProxy: true
最终 baseURL: /api/ai
==================
```

然后测试生成功能，终端应该显示：
```
[Proxy] POST /api/ai/chat/completions -> /compatible-mode/v1/chat/completions
[Proxy] Response: 200 for /api/ai/chat/completions
```

## 快速诊断命令

### 检查环境变量文件

```bash
cat .env.local
```

### 正确的内容应该是

```env
VITE_ALICLOUD_API_KEY=sk-xxxxx
VITE_ALICLOUD_MODEL=qwen-turbo
```

### 如果看到这些，需要删除

```env
VITE_USE_PROXY=false          # ← 删除这行
VITE_ALICLOUD_BASE_URL=...    # ← 删除这行
```

## 常见错误配置

### 错误 1：设置了错误的 BASE_URL

```env
❌ VITE_ALICLOUD_BASE_URL=/compatible-mode/v1
```

**原因**：这会导致前端直接请求这个路径，而不是通过代理

**修复**：删除这一行

### 错误 2：禁用了代理

```env
❌ VITE_USE_PROXY=false
```

**原因**：会导致直接调用阿里云 API，遇到 CORS 错误

**修复**：删除这一行或设置为 `true`

### 错误 3：BASE_URL 包含完整路径

```env
❌ VITE_ALICLOUD_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

**原因**：在代理模式下不需要这个配置

**修复**：删除这一行

## 完整的 .env.local 示例

```env
# ============================================
# 阿里云配置（最小配置）
# ============================================

# API Key（必填）
VITE_ALICLOUD_API_KEY=sk-your-key-here

# 模型名称（可选，默认 qwen-turbo）
VITE_ALICLOUD_MODEL=qwen-turbo

# ============================================
# 以下配置不需要！
# ============================================
# VITE_USE_PROXY=true  # 默认就是 true，不需要设置
# VITE_ALICLOUD_BASE_URL=...  # 代理模式下不需要
```

## 验证清单

- [ ] `.env.local` 只包含 API Key 和 Model
- [ ] **没有** `VITE_USE_PROXY=false`
- [ ] **没有** `VITE_ALICLOUD_BASE_URL`
- [ ] 已重启开发服务器
- [ ] 浏览器控制台显示 `useProxy: true`
- [ ] 浏览器控制台显示 `最终 baseURL: /api/ai`
- [ ] 终端显示正确的代理日志

## 如果还是不行

1. **完全删除 `.env.local`**，重新创建：

```bash
rm .env.local
cp .env.example .env.local
# 然后编辑 .env.local，只填入 API Key
```

2. **清除浏览器缓存**：
   - 打开开发者工具（F12）
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"

3. **检查是否有其他环境变量文件**：
```bash
ls -la | grep env
```

确保只有 `.env.local` 和 `.env.example`

---

**总结**：
- ✅ 只需要配置 API Key 和 Model
- ❌ 不要设置 BASE_URL
- ❌ 不要设置 USE_PROXY=false
- 🔄 修改后必须重启服务器

