import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown 渲染组件
 * 使用 markdown-it 渲染 Markdown 内容，并适配 Ant Design 样式
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // 创建 markdown-it 实例（使用 useMemo 避免重复创建）
  const md = useMemo(() => {
    return new MarkdownIt({
      html: false,        // 不允许 HTML 标签（安全性）
      linkify: true,      // 自动转换 URL 为链接
      typographer: true,  // 启用智能标点
      breaks: true,       // 转换换行符为 <br>
    });
  }, []);

  // 渲染 Markdown 为 HTML
  const htmlContent = useMemo(() => {
    return md.render(content);
  }, [md, content]);

  return (
    <div 
      className="markdown-renderer"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;

