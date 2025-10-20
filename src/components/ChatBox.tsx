import { useState, useRef, useEffect } from 'react';
import { Input, Button, Space, Avatar, Card, Typography, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { ChatMessage } from '../types/story';
import MarkdownRenderer from './MarkdownRenderer';

const { TextArea } = Input;
const { Text } = Typography;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        {/* 消息列表区域 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            minHeight: 0,
          }}
        >
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>开始对话，创作您的绘本故事</div>
          </div>
        )}

        {messages.map((message, index) => {
          const isLatestAssistant = 
            message.role === 'assistant' && 
            index === messages.length - 1 && 
            isLoading;
          
          return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px',
              }}
            >
              {message.role === 'assistant' && (
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: '#1890ff', marginRight: '8px' }}
                />
              )}

              <div style={{ maxWidth: '70%' }}>
                <Card
                  size="small"
                  style={{
                    backgroundColor: message.role === 'user' ? '#1890ff' : '#fff',
                    color: message.role === 'user' ? '#fff' : '#000',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: isLatestAssistant ? '1px solid #1890ff' : undefined,
                  }}
                  bodyStyle={{ 
                    padding: '12px 16px',
                    lineHeight: '1.6',
                  }}
                >
                  {message.role === 'user' ? (
                    // 用户消息使用简单的文本显示
                    <div 
                      style={{ 
                        whiteSpace: 'pre-wrap', 
                        wordBreak: 'break-word',
                        fontSize: '14px',
                      }}
                    >
                      {message.content}
                    </div>
                  ) : (
                    // AI 消息使用 Markdown 渲染
                    <div style={{ fontSize: '14px' }}>
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                  {isLatestAssistant && (
                    <span style={{ 
                      display: 'inline-block',
                      width: '8px',
                      height: '14px',
                      backgroundColor: '#1890ff',
                      marginLeft: '4px',
                      animation: 'blink 1s infinite',
                    }} />
                  )}
                </Card>
                <Text
                  type="secondary"
                  style={{
                    fontSize: '12px',
                    marginTop: '4px',
                    display: 'block',
                    textAlign: message.role === 'user' ? 'right' : 'left',
                  }}
                >
                  {formatTime(message.timestamp)}
                  {isLatestAssistant && ' · 生成中...'}
                </Text>
              </div>

              {message.role === 'user' && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#87d068', marginLeft: '8px' }}
                />
              )}
            </div>
          );
        })}

        {isLoading && messages.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <Avatar
              icon={<RobotOutlined />}
              style={{ backgroundColor: '#1890ff', marginRight: '8px' }}
            />
            <Card size="small" bodyStyle={{ padding: '12px' }}>
              <Space>
                <Spin size="small" />
                <span>正在思考...</span>
              </Space>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div style={{ padding: '16px', backgroundColor: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ resize: 'none' }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim() || disabled || isLoading}
            loading={isLoading}
          >
            发送
          </Button>
        </Space.Compact>
      </div>
      </div>
    </>
  );
};

export default ChatBox;

