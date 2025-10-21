import { useRef, useEffect } from 'react';
import { Button } from 'antd-mobile';
import { Bubble, Sender } from '@ant-design/x';
import type { ChatMessage } from '../types/story';
import MarkdownRenderer from './MarkdownRenderer';
import './ChatBox.css';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
  onRetry?: () => void; // 重新生成的回调
  step?: number; // 当前步骤，用于重置输入框
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isLoading,
  placeholder = '请输入消息...',
  disabled = false,
  onRetry,
  step = 0,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 渲染用户头像
  const renderUserAvatar = () => (
    <div className="message-avatar user">👤</div>
  );

  // 渲染 AI 头像
  const renderAssistantAvatar = () => (
    <div className="message-avatar assistant">🤖</div>
  );

  // 处理重新生成
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="chatbox-container">
      {/* 消息列表区域 */}
      <div className="messages-area">
        {messages.length === 0 && !isLoading ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-text">开始对话，创作您的绘本故事</div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => {
              const isLatestAssistant =
                message.role === 'assistant' && index === messages.length - 1 && isLoading;
              const isErrorMessage = message.isError && message.role === 'assistant';

              return (
                <div
                  key={message.id}
                  className={`message-item ${message.role}`}
                >
                  {message.role === 'assistant' && renderAssistantAvatar()}

                  <div className="message-content-wrapper">
                    <Bubble
                      placement={message.role === 'user' ? 'end' : 'start'}
                      typing={isLatestAssistant}
                      variant={isErrorMessage ? 'outlined' : undefined}
                      classNames={{
                        content: isErrorMessage ? 'bubble-error' : undefined,
                      }}
                      content={
                        message.role === 'user' ? (
                          <div className="message-text">{message.content}</div>
                        ) : (
                          <div className="message-markdown">
                            <MarkdownRenderer content={message.content} />
                          </div>
                        )
                      }
                    />
                    {isErrorMessage && onRetry && (
                      <Button
                        size="small"
                        color="primary"
                        fill="outline"
                        onClick={handleRetry}
                        disabled={isLoading}
                        style={{ marginTop: '8px' }}
                      >
                        🔄 重新生成
                      </Button>
                    )}
                    <div className="message-timestamp">
                      {formatTime(message.timestamp)}
                      {isLatestAssistant && ' · 生成中...'}
                    </div>
                  </div>

                  {message.role === 'user' && renderUserAvatar()}
                </div>
              );
            })}
          </div>
        )}

        <div ref={messagesEndRef} className="messages-end" />
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <Sender
          key={`sender-${step}`}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          loading={isLoading}
          onSubmit={onSendMessage}
          className="chat-sender"
        />
      </div>
    </div>
  );
};

export default ChatBox;
