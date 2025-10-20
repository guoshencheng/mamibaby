# Markdown 渲染使用说明

## 概述

本项目使用 `markdown-it` 库来渲染 AI 输出的 Markdown 内容，并通过 CSS 样式适配 Ant Design 设计规范。

## 已实现的功能

### 1. MarkdownRenderer 组件

位置：`src/components/MarkdownRenderer.tsx`

这是一个封装好的 Markdown 渲染组件，基于 `markdown-it` 实现，支持以下特性：

- ✅ **标题** (h1-h6)：完整的标题层级支持，样式符合 Ant Design 规范
- ✅ **段落**：自动换行和段落间距
- ✅ **强调文本**：加粗（**bold**）和斜体（*italic*）
- ✅ **代码块**：支持行内代码和代码块，带语法高亮样式
- ✅ **引用**：带左侧蓝色边框和浅蓝背景的引用样式
- ✅ **列表**：有序列表和无序列表，支持嵌套
- ✅ **分隔线**：水平分隔线
- ✅ **链接**：自动识别 URL，带 hover 效果
- ✅ **表格**：完整的表格支持，带 hover 效果
- ✅ **删除线**：~~删除的文本~~

### 2. 集成到聊天框

已在 `ChatBox.tsx` 中集成：
- 用户消息：使用简单文本显示
- AI 消息：使用 Markdown 渲染器

## 使用示例

### 基本用法

```tsx
import MarkdownRenderer from './components/MarkdownRenderer';

function MyComponent() {
  const content = `
# 这是标题

这是一个段落，支持 **加粗** 和 *斜体*。

## 列表示例

- 项目 1
- 项目 2
- 项目 3

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`
  `;

  return <MarkdownRenderer content={content} />;
}
```

### 在聊天框中的应用

AI 输出的内容会自动使用 Markdown 渲染，例如：

```typescript
// AI 可以输出这样的内容
const aiResponse = `
## 故事概要

让我为您创作一个故事：

**主角**：一只勇敢的小兔子  
**场景**：神秘的森林

### 故事情节

1. 小兔子离开家园
2. 遇到困难
3. 找到解决方案
4. 成功返回

> 这是一个关于勇气和智慧的故事。
`;
```

## 支持的 Markdown 语法

| 语法 | 效果 | 示例 |
|------|------|------|
| `# 标题` | 一级标题 | `# 这是标题` |
| `## 标题` | 二级标题 | `## 这是副标题` |
| `**文本**` | 加粗 | `**重要**` |
| `*文本*` | 斜体 | `*强调*` |
| `` `代码` `` | 行内代码 | `` `const a = 1` `` |
| ` ``` ` | 代码块 | ` ```js\ncode\n``` ` |
| `> 引用` | 引用块 | `> 这是引用` |
| `- 项目` | 列表 | `- 列表项` |
| `[链接](url)` | 超链接 | `[点击](https://...)` |
| `---` | 分隔线 | `---` |

## 自定义样式

如需自定义样式，可以直接修改 `MarkdownRenderer.css` 文件。

### 示例：修改标题颜色

```css
.markdown-renderer h1 {
  font-size: 38px;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1890ff; /* 自定义颜色 */
  line-height: 1.23;
}
```

### 示例：修改代码块背景

```css
.markdown-renderer pre {
  background-color: #282c34; /* 深色背景 */
  color: #abb2bf; /* 浅色文字 */
  border: 1px solid #444;
  border-radius: 6px;
  padding: 12px 16px;
  overflow: auto;
  margin: 1em 0;
}
```

## 注意事项

1. **性能**：Markdown 渲染器会实时更新，适合流式输出
2. **安全性**：默认不渲染 HTML 标签，避免 XSS 攻击
3. **样式一致性**：所有样式都与 Ant Design 主题保持一致

## 扩展功能

`markdown-it` 支持丰富的插件系统，可以添加更多功能：

### 1. 代码语法高亮

```bash
pnpm add markdown-it-highlightjs highlight.js
```

```tsx
import MarkdownIt from 'markdown-it';
import hljs from 'markdown-it-highlightjs';

const md = new MarkdownIt().use(hljs);
```

### 2. Emoji 支持

```bash
pnpm add markdown-it-emoji
```

```tsx
import emoji from 'markdown-it-emoji';

const md = new MarkdownIt().use(emoji);
```

### 3. 任务列表

```bash
pnpm add markdown-it-task-lists
```

```tsx
import taskLists from 'markdown-it-task-lists';

const md = new MarkdownIt().use(taskLists);
```

### 4. 数学公式（KaTeX）

```bash
pnpm add markdown-it-katex katex
```

```tsx
import katex from 'markdown-it-katex';

const md = new MarkdownIt().use(katex);
```

## 相关文件

- `src/components/MarkdownRenderer.tsx` - 主组件
- `src/components/MarkdownRenderer.css` - 样式文件
- `src/components/ChatBox.tsx` - 集成示例

## markdown-it 配置选项

当前配置：

```tsx
new MarkdownIt({
  html: false,        // 不允许 HTML 标签（安全性）
  linkify: true,      // 自动转换 URL 为链接
  typographer: true,  // 启用智能标点
  breaks: true,       // 转换换行符为 <br>
});
```

更多配置选项请参考 [markdown-it 文档](https://github.com/markdown-it/markdown-it#init-with-presets-and-options)。

## 参考资源

- [markdown-it 官方文档](https://github.com/markdown-it/markdown-it)
- [markdown-it 插件列表](https://www.npmjs.com/search?q=keywords:markdown-it-plugin)
- [Ant Design 设计规范](https://ant.design/docs/spec/introduce-cn)

