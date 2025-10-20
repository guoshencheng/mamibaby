import { useState, useRef, useEffect } from 'react';
import { Button, TextArea, DotLoading } from 'antd-mobile';
import { SendOutline } from 'antd-mobile-icons';
import type { ChatMessage } from '../types/story';
import MarkdownRenderer from './MarkdownRenderer';
import './ChatBox.css';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isLoading,
  placeholder = '请输入消息...',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading || disabled) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
  };

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

  return (
    <div className="chatbox-container">
      {/* 消息列表区域 */}
      <div className="messages-area">
        {messages.length === 0 && !isLoading && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-text">开始对话，创作您的绘本故事</div>
          </div>
        )}

        {messages.map((message, index) => {
          const isLatestAssistant =
            message.role === 'assistant' && index === messages.length - 1 && isLoading;

          return (
            <div
              key={message.id}
              className={`message-item ${message.role}`}
            >
              {message.role === 'assistant' && renderAssistantAvatar()}

              <div className="message-content-wrapper">
                <div
                  className={`message-bubble ${message.role} ${
                    isLatestAssistant ? 'loading' : ''
                  }`}
                >
                  {message.role === 'user' ? (
                    // 用户消息使用简单的文本显示
                    <div className="message-text">{message.content}</div>
                  ) : (
                    // AI 消息使用 Markdown 渲染
                    <div className="message-markdown">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                  {isLatestAssistant && (
                    <div className="typing-indicator">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  )}
                </div>
                <div className="message-timestamp">
                  {formatTime(message.timestamp)}
                  {isLatestAssistant && ' · 生成中...'}
                </div>
              </div>

              {message.role === 'user' && renderUserAvatar()}
            </div>
          );
        })}

        {isLoading && messages.length === 0 && (
          <div className="message-item assistant">
            {renderAssistantAvatar()}
            <div className="message-content-wrapper">
              <div className="message-bubble assistant">
                <DotLoading /> 正在思考...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="messages-end" />
      </div>

      {/* 输入区域 */}
      <div className="input-area">
        <TextArea
          className="input-textarea"
          value={inputValue}
          onChange={(val) => setInputValue(val)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onEnterPress={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          className="send-button"
          color="primary"
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled || isLoading}
          loading={isLoading}
        >
          <SendOutline />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
