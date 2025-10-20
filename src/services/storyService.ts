import { stepCountIs, streamText, type CoreMessage } from 'ai';
import { alicloud, getModelName, validateAIConfig } from '../config/ai';
import {
  storySummarySchema,
  storyElementsSchema,
  storyboardDetailsSchema,
  type StorySummary,
  type StepTwoData,
  type StoryboardSummary,
  type StoryboardDetail,
  type ChatMessage,
} from '../types/story';
import {
  STEP1_SYSTEM_PROMPT,
  STEP1_USER_PROMPT,
  STEP2_SYSTEM_PROMPT,
  STEP2_USER_PROMPT,
  STEP3_SYSTEM_PROMPT,
  STEP3_USER_PROMPT,
  fillPrompt,
} from '../prompts/storyPrompts';

/**
 * 将聊天消息转换为 AI SDK 的消息格式
 */
const convertToCoreMessages = (messages: ChatMessage[]): CoreMessage[] => {
  return messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
};

/**
 * 生成故事概要（流式 + 工具调用）
 * @param prompt 用户输入的故事提示
 * @param historyMessages 历史消息
 * @param onUpdate 流式更新回调
 * @returns 故事概要
 */
export const generateStorySummary = async (
  prompt: string,
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StorySummary> => {
  console.log('🎨 生成故事概要，提示词:', prompt);
  console.log('📝 历史消息数量:', historyMessages.length);
  
  // 验证配置
  const configCheck = validateAIConfig();
  if (!configCheck.valid) {
    throw new Error(configCheck.error);
  }

  try {
    const userPrompt = fillPrompt(STEP1_USER_PROMPT, { prompt });
    
    let capturedSummary: string | null = null;
    
    // 构建消息列表
    const messages: CoreMessage[] = [
      ...convertToCoreMessages(historyMessages),
      { role: 'user', content: userPrompt },
    ];
    
    const result = streamText({
      model: alicloud(getModelName()),
      system: STEP1_SYSTEM_PROMPT,
      messages,
      stopWhen: stepCountIs(20),
      tools: {
        submitStorySummary: {
          description: '提交生成的故事概要。当你完成故事概要的创作后，调用此工具提交结果。提交后请告知用户故事概要已经生成并保存到右侧面板。',
          inputSchema: storySummarySchema,
          execute: async (params: { summary: string }) => {
            capturedSummary = params.summary;
            return { success: true, message: '故事概要已成功保存到右侧面板，您可以在右侧查看完整内容。' };
          },
        },
      },
    });

    // 处理流式文本输出
    let fullText = '';
    for await (const chunk of result.textStream) {
      fullText += chunk;
      if (onUpdate) {
        onUpdate(fullText);
      }
    }

    // 等待所有步骤完成
    await result.text;
    
    if (!capturedSummary) {
      throw new Error('AI 未返回故事概要结果');
    }

    console.log('✅ 故事概要生成成功:', capturedSummary);

    return {
      prompt,
      summary: capturedSummary,
    };
  } catch (error) {
    console.error('❌ 生成故事概要失败:', error);
    throw new Error(`生成故事概要失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 生成故事核心元素（人物、物品、场景、分镜概要）（流式 + 工具调用）
 * @param summary 第一步生成的故事概要
 * @param historyMessages 历史消息
 * @param onUpdate 流式更新回调
 * @returns 核心元素数据
 */
export const generateStoryElements = async (
  summary: StorySummary,
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StepTwoData> => {
  console.log('🎨 生成故事核心元素，基于概要:', summary.summary);
  console.log('📝 历史消息数量:', historyMessages.length);
  
  // 验证配置
  const configCheck = validateAIConfig();
  if (!configCheck.valid) {
    throw new Error(configCheck.error);
  }

  try {
    const userPrompt = fillPrompt(STEP2_USER_PROMPT, {
      summary: summary.summary,
    });
    
    let capturedElements: StepTwoData | null = null;
    
    // 构建消息列表
    const messages: CoreMessage[] = [
      ...convertToCoreMessages(historyMessages),
      { role: 'user', content: userPrompt },
    ];
    
    const result = streamText({
      model: alicloud(getModelName()),
      system: STEP2_SYSTEM_PROMPT,
      messages,
      stopWhen: [stepCountIs(20)],
      tools: {
        submitStoryElements: {
          description: '提交生成的故事核心元素（人物、物品、场景、分镜概要）。当你完成所有元素的设计后，调用此工具提交结果。提交后请告知用户各项元素已经生成并保存到右侧面板。',
          inputSchema: storyElementsSchema,
          execute: async (params: StepTwoData) => {
            capturedElements = {
              characters: params.characters,
              keyItems: params.keyItems,
              sceneFeatures: params.sceneFeatures,
              storyboardSummaries: params.storyboardSummaries,
            };
            return { 
              success: true, 
              message: `核心元素已成功保存到右侧面板：
- ${params.characters.length} 个关键人物
- ${params.keyItems.length} 个关键物品
- ${params.sceneFeatures.length} 个场景特征
- ${params.storyboardSummaries.length} 个分镜概要
您可以在右侧查看详细信息。` 
            };
          },
        },
      },
    });

    // 处理流式文本输出
    let fullText = '';
    for await (const chunk of result.textStream) {
      fullText += chunk;
      if (onUpdate) {
        onUpdate(fullText);
      }
    }

    // 等待所有步骤完成
    await result.text;
    
    if (!capturedElements) {
      throw new Error('AI 未返回核心元素结果');
    }

    console.log('✅ 核心元素生成成功:', capturedElements);

    return capturedElements;
  } catch (error) {
    console.error('❌ 生成核心元素失败:', error);
    throw new Error(`生成核心元素失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

/**
 * 生成分镜详情（流式 + 工具调用）
 * @param summaries 第二步生成的分镜概要列表
 * @param historyMessages 历史消息
 * @param onUpdate 流式更新回调
 * @returns 分镜详情列表
 */
export const generateStoryboardDetails = async (
  summaries: StoryboardSummary[],
  historyMessages: ChatMessage[] = [],
  onUpdate?: (text: string) => void
): Promise<StoryboardDetail[]> => {
  console.log('🎨 生成分镜详情，基于概要列表:', summaries);
  console.log('📝 历史消息数量:', historyMessages.length);
  
  // 验证配置
  const configCheck = validateAIConfig();
  if (!configCheck.valid) {
    throw new Error(configCheck.error);
  }

  try {
    // 将分镜概要格式化为字符串
    const summariesText = summaries
      .map(s => `[分镜${s.sequence}] ${s.sceneDescription}${s.dialogue ? ` - 对话："${s.dialogue}"` : ''}`)
      .join('\n');

    const userPrompt = fillPrompt(STEP3_USER_PROMPT, {
      storyboardSummaries: summariesText,
    });
    
    let capturedDetails: StoryboardDetail[] | null = null;
    
    // 构建消息列表
    const messages: CoreMessage[] = [
      ...convertToCoreMessages(historyMessages),
      { role: 'user', content: userPrompt },
    ];
    
    const result = streamText({
      model: alicloud(getModelName()),
      system: STEP3_SYSTEM_PROMPT,
      messages,
      tools: {
        submitStoryboardDetails: {
          description: '提交生成的分镜详情列表。当你完成所有分镜的详细描述后，调用此工具提交结果。提交后请告知用户分镜详情已经生成并保存到右侧面板。',
          inputSchema: storyboardDetailsSchema,
          execute: async (params: { details: StoryboardDetail[] }) => {
            capturedDetails = params.details;
            return { 
              success: true, 
              message: `已成功生成 ${params.details.length} 个分镜的详细描述并保存到右侧面板。每个分镜都包含详细的场景描述、镜头角度、人物动作和视觉元素建议。您可以在右侧查看完整信息。` 
            };
          },
        },
      },
    });

    // 处理流式文本输出
    let fullText = '';
    for await (const chunk of result.textStream) {
      fullText += chunk;
      if (onUpdate) {
        onUpdate(fullText);
      }
    }

    // 等待所有步骤完成
    await result.text;
    
    if (!capturedDetails) {
      throw new Error('AI 未返回分镜详情结果');
    }

    console.log('✅ 分镜详情生成成功:', capturedDetails);

    return capturedDetails;
  } catch (error) {
    console.error('❌ 生成分镜详情失败:', error);
    throw new Error(`生成分镜详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};
