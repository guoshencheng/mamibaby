import { z } from 'zod';

// ============================================================================
// TypeScript 接口定义
// ============================================================================

// 故事概要
export interface StorySummary {
  prompt: string;      // 用户输入的提示
  summary: string;     // 生成的概要
}

// 关键人物
export interface Character {
  id: string;
  name: string;        // 姓名
  appearance: string;  // 外貌描述
  clothing: string;    // 衣物描述
  personality: string; // 性格特征
}

// 关键物品
export interface KeyItem {
  id: string;
  name: string;        // 物品名称
  description: string; // 物品描述
  features: string;    // 特征
}

// 场景特征
export interface SceneFeature {
  id: string;
  name: string;        // 场景名称
  environment: string; // 环境描述
  time: string;        // 时间（白天/夜晚等）
  atmosphere: string;  // 氛围
}

// 分镜概要
export interface StoryboardSummary {
  id: string;
  sequence: number;    // 序号
  sceneDescription: string; // 场景描述
  dialogue?: string;   // 对话（可选）
}

// 分镜详情
export interface StoryboardDetail {
  id: string;
  summaryId: string;   // 关联的概要ID
  detailedDescription: string; // 详细描述
  cameraAngle: string; // 镜头角度
  characterActions: string; // 人物动作
  visualElements: string; // 视觉元素
}

// 第二步的综合数据结构
export interface StepTwoData {
  characters: Character[];       // 关键人物列表
  keyItems: KeyItem[];          // 关键物品列表
  sceneFeatures: SceneFeature[]; // 场景特征列表
  storyboardSummaries: StoryboardSummary[]; // 分镜概要列表
}

// 完整的故事数据结构
export interface StoryData {
  summary: StorySummary | null;
  elements: StepTwoData | null;
  details: StoryboardDetail[] | null;
}

// ============================================================================
// 聊天消息类型
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  data?: any; // 附加的结构化数据
}

export interface StepChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// Zod Schemas（用于 AI generateObject）
// ============================================================================

// 关键人物 Schema
export const characterSchema = z.object({
  id: z.string().describe('唯一标识符'),
  name: z.string().describe('人物姓名'),
  appearance: z.string().describe('外貌描述，包括年龄、身高、体型、面容特征等'),
  clothing: z.string().describe('衣物描述，包括衣服款式、颜色、配饰等'),
  personality: z.string().describe('性格特征，包括主要性格、行为特点等'),
});

// 关键物品 Schema
export const keyItemSchema = z.object({
  id: z.string().describe('唯一标识符'),
  name: z.string().describe('物品名称'),
  description: z.string().describe('物品的基本描述'),
  features: z.string().describe('物品的关键特征，包括外观、材质、功能等'),
});

// 场景特征 Schema
export const sceneFeatureSchema = z.object({
  id: z.string().describe('唯一标识符'),
  name: z.string().describe('场景名称'),
  environment: z.string().describe('环境描述，包括地点、周围事物、环境特点等'),
  time: z.string().describe('时间，如白天、夜晚、清晨、黄昏等'),
  atmosphere: z.string().describe('氛围描述，如温馨、神秘、紧张、欢快等'),
});

// 分镜概要 Schema
export const storyboardSummarySchema = z.object({
  id: z.string().describe('唯一标识符'),
  sequence: z.number().describe('分镜序号，从1开始'),
  sceneDescription: z.string().describe('场景描述，包括场景、人物动作、关键事件'),
  dialogue: z.string().optional().describe('对话内容（可选）'),
});

// 分镜详情 Schema
export const storyboardDetailSchema = z.object({
  id: z.string().describe('唯一标识符'),
  summaryId: z.string().describe('关联的分镜概要ID'),
  detailedDescription: z.string().describe('详细的场景描述，包括所有细节'),
  cameraAngle: z.string().describe('镜头角度，如近景、远景、特写、俯视、仰视等'),
  characterActions: z.string().describe('人物的具体动作和表情'),
  visualElements: z.string().describe('视觉元素，包括光线、色调、构图等'),
});

// 第一步：故事概要 Schema
export const storySummarySchema = z.object({
  summary: z.string().describe('故事概要，包括故事背景、主要情节、主题思想等'),
});

// 第二步：核心元素 Schema
export const storyElementsSchema = z.object({
  characters: z.array(characterSchema).describe('关键人物列表'),
  keyItems: z.array(keyItemSchema).describe('关键物品列表'),
  sceneFeatures: z.array(sceneFeatureSchema).describe('场景特征列表'),
  storyboardSummaries: z.array(storyboardSummarySchema).describe('分镜概要列表'),
});

// 第三步：分镜详情 Schema
export const storyboardDetailsSchema = z.object({
  details: z.array(storyboardDetailSchema).describe('分镜详情列表'),
});

// ============================================================================
// 步骤上下文信息（用于在聊天界面顶部显示）
// ============================================================================

export interface StepContextInfo {
  step1?: {
    prompt: string;
    summaryPreview: string; // 概要摘要
  };
  step2?: {
    charactersCount: number;
    keyItemsCount: number;
    sceneFeaturesCount: number;
    storyboardsCount: number;
  };
}
