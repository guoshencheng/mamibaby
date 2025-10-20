import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const qwenProvider = createOpenAICompatible({
  apiKey: import.meta.env.VITE_ALICLOUD_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  name: 'qwen',
});

// 创建阿里云 OpenAI 兼容客户端
export const alicloud = qwenProvider;

// 获取配置的模型名称
export const getModelName = () => {
  return import.meta.env.VITE_ALICLOUD_MODEL || 'qwen-turbo';
};

// 验证配置是否完整
export const validateAIConfig = (): { valid: boolean; error?: string } => {
  const apiKey = import.meta.env.VITE_ALICLOUD_API_KEY;
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    return {
      valid: false,
      error: '请在 .env.local 中配置 VITE_ALICLOUD_API_KEY',
    };
  }
  
  return { valid: true };
};

