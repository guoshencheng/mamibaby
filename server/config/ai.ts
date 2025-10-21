import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import dotenv from 'dotenv';

// 确保环境变量已加载
dotenv.config();

console.log('ALICLOUD_API_KEY:', process.env.ALICLOUD_API_KEY);

const qwenProvider = createOpenAICompatible({
  apiKey: process.env.ALICLOUD_API_KEY || '',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  name: 'qwen',
});

// 创建阿里云 OpenAI 兼容客户端
export const alicloud = qwenProvider;

// 获取配置的模型名称
export const getModelName = () => {
  return process.env.ALICLOUD_MODEL || 'qwen-turbo';
};

// 验证配置是否完整
export const validateAIConfig = (): { valid: boolean; error?: string } => {
  const apiKey = process.env.ALICLOUD_API_KEY;
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    return {
      valid: false,
      error: '请在 .env 文件中配置 ALICLOUD_API_KEY',
    };
  }
  
  return { valid: true };
};

