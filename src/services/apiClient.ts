import { getToken, removeToken } from './authService';
import type { ChatMessage, StorySummary, StepTwoData, StoryboardDetail } from '../types/story';

const API_BASE = '/api';

// 通用请求函数
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  // 处理认证失败
  if (response.status === 401) {
    removeToken();
    window.location.href = '/';
    throw new Error('认证失败，请重新登录');
  }

  return response;
};

// 处理 SSE 流式响应
const handleStreamResponse = async (
  url: string,
  body: any,
  onUpdate: (text: string) => void
): Promise<any> => {
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '请求失败');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('无法读取响应流');
  }

  const decoder = new TextDecoder();
  let fullText = '';
  let result: any = null;

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n\n');

    for (const line of lines) {
      if (!line.trim() || !line.startsWith('data: ')) continue;

      const data = line.replace('data: ', '').trim();
      
      if (data === '[DONE]') {
        return result;
      }

      try {
        const parsed = JSON.parse(data);
        
        if (parsed.type === 'text') {
          fullText += parsed.content;
          onUpdate(fullText);
        } else if (parsed.type === 'result') {
          result = parsed.data;
        }
      } catch (e) {
        console.error('解析响应失败:', e);
      }
    }
  }

  return result;
};

// 生成故事概要
export const generateStorySummary = async (
  prompt: string,
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StorySummary> => {
  const result = await handleStreamResponse(
    '/story/summary',
    {
      prompt,
      historyMessages: historyMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    },
    onUpdate || (() => {})
  );

  if (!result) {
    throw new Error('AI 未返回故事概要结果');
  }

  return result;
};

// 生成核心元素
export const generateStoryElements = async (
  summary: StorySummary,
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StepTwoData> => {
  const result = await handleStreamResponse(
    '/story/elements',
    {
      summary,
      historyMessages: historyMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    },
    onUpdate || (() => {})
  );

  if (!result) {
    throw new Error('AI 未返回核心元素结果');
  }

  return result;
};

// 生成分镜详情
export const generateStoryboardDetails = async (
  summaries: any[],
  elements: StepTwoData,
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StoryboardDetail[]> => {
  const result = await handleStreamResponse(
    '/story/details',
    {
      summaries,
      elements,
      historyMessages: historyMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    },
    onUpdate || (() => {})
  );

  if (!result) {
    throw new Error('AI 未返回分镜详情结果');
  }

  return result;
};

