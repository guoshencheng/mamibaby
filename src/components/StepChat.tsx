import { useState } from 'react';
import { Toast, Collapse } from 'antd-mobile';
import ChatBox from './ChatBox';
import type {
  ChatMessage,
  StorySummary,
  StepTwoData,
  StoryboardDetail,
  StepContextInfo,
} from '../types/story';
import {
  generateStorySummary,
  generateStoryElements,
  generateStoryboardDetails,
} from '../services/storyService';

interface StepChatProps {
  step: number;
  summary: StorySummary | null;
  setSummary: (summary: StorySummary) => void;
  elements: StepTwoData | null;
  setElements: (elements: StepTwoData) => void;
  setDetails: (details: StoryboardDetail[]) => void;
}

const StepChat: React.FC<StepChatProps> = ({
  step,
  summary,
  setSummary,
  elements,
  setElements,
  setDetails,
}) => {
  // 为每个步骤维护独立的消息列表
  const [stepMessages, setStepMessages] = useState<Record<number, ChatMessage[]>>({
    0: [],
    1: [],
    2: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // 添加消息到当前步骤的聊天记录
  const addMessage = (role: 'user' | 'assistant', content: string, data?: any) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
      data,
    };
    setStepMessages((prev) => ({
      ...prev,
      [step]: [...(prev[step] || []), newMessage],
    }));
    return newMessage;
  };

  // 处理第一步：生成故事概要
  const handleStepOne = async (userInput: string) => {
    try {
      setIsLoading(true);

      // 创建一个临时消息用于显示流式输出
      const tempMessage = addMessage('assistant', '正在思考...');

      // 获取当前步骤的历史消息（排除临时消息）
      const historyMessages = (stepMessages[step] || []).filter(
        (msg) => msg.id !== tempMessage.id && msg.role !== 'system'
      );

      // 调用 AI 生成故事概要，传入历史消息和流式更新回调
      const result = await generateStorySummary(userInput, historyMessages, (streamText) => {
        // 实时更新消息内容（只显示思考过程）
        setStepMessages((prev) => ({
          ...prev,
          [step]: prev[step].map((msg) =>
            msg.id === tempMessage.id ? { ...msg, content: streamText } : msg
          ),
        }));
      });

      // 保存结果到右侧面板
      setSummary(result);

      // 流式输出结束后，消息内容保持为 LLM 最后输出的内容
      // LLM 会在工具调用后继续输出确认信息

      Toast.show({
        icon: 'success',
        content: '故事概要生成成功！',
      });
    } catch (error) {
      console.error('生成故事概要失败:', error);
      addMessage(
        'assistant',
        `抱歉，生成失败了：${error instanceof Error ? error.message : '未知错误'}`
      );
      Toast.show({
        icon: 'fail',
        content: '生成失败，请重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理第二步：生成核心元素
  const handleStepTwo = async (_userInput: string) => {
    if (!summary) {
      addMessage('assistant', '请先完成第一步生成故事概要。');
      return;
    }

    try {
      setIsLoading(true);

      // 创建一个临时消息用于显示流式输出
      const tempMessage = addMessage('assistant', '正在分析故事元素...');

      // 获取当前步骤的历史消息（排除临时消息）
      const historyMessages = (stepMessages[step] || []).filter(
        (msg) => msg.id !== tempMessage.id && msg.role !== 'system'
      );

      // 调用 AI 生成核心元素，传入历史消息和流式更新回调
      const result = await generateStoryElements(summary, historyMessages, (streamText) => {
        // 实时更新消息内容（只显示思考过程）
        setStepMessages((prev) => ({
          ...prev,
          [step]: prev[step].map((msg) =>
            msg.id === tempMessage.id ? { ...msg, content: streamText } : msg
          ),
        }));
      });

      // 保存结果到右侧面板
      setElements(result);

      // 流式输出结束后，消息内容保持为 LLM 最后输出的内容
      // LLM 会在工具调用后继续输出确认信息

      Toast.show({
        icon: 'success',
        content: '核心元素生成成功！',
      });
    } catch (error) {
      console.error('生成核心元素失败:', error);
      addMessage(
        'assistant',
        `抱歉，生成失败了：${error instanceof Error ? error.message : '未知错误'}`
      );
      Toast.show({
        icon: 'fail',
        content: '生成失败，请重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理第三步：生成分镜详情
  const handleStepThree = async (_userInput: string) => {
    if (!elements || !elements.storyboardSummaries) {
      addMessage('assistant', '请先完成第二步生成核心元素。');
      return;
    }

    try {
      setIsLoading(true);

      // 创建一个临时消息用于显示流式输出
      const tempMessage = addMessage('assistant', '正在生成分镜详情...');

      // 获取当前步骤的历史消息（排除临时消息）
      const historyMessages = (stepMessages[step] || []).filter(
        (msg) => msg.id !== tempMessage.id && msg.role !== 'system'
      );

      // 调用 AI 生成分镜详情，传入历史消息和流式更新回调
      const result = await generateStoryboardDetails(
        elements.storyboardSummaries,
        historyMessages,
        (streamText) => {
          // 实时更新消息内容（只显示思考过程）
          setStepMessages((prev) => ({
            ...prev,
            [step]: prev[step].map((msg) =>
              msg.id === tempMessage.id ? { ...msg, content: streamText } : msg
            ),
          }));
        }
      );

      // 保存结果到右侧面板
      setDetails(result);

      // 流式输出结束后，消息内容保持为 LLM 最后输出的内容
      // LLM 会在工具调用后继续输出确认信息

      Toast.show({
        icon: 'success',
        content: '分镜详情生成成功！',
      });
    } catch (error) {
      console.error('生成分镜详情失败:', error);
      addMessage(
        'assistant',
        `抱歉，生成失败了：${error instanceof Error ? error.message : '未知错误'}`
      );
      Toast.show({
        icon: 'fail',
        content: '生成失败，请重试',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 生成上下文信息
  const getContextInfo = (): StepContextInfo => {
    const info: StepContextInfo = {};

    if (step >= 1 && summary) {
      info.step1 = {
        prompt: summary.prompt,
        summaryPreview:
          summary.summary.substring(0, 150) + (summary.summary.length > 150 ? '...' : ''),
      };
    }

    if (step >= 2 && elements) {
      info.step2 = {
        charactersCount: elements.characters.length,
        keyItemsCount: elements.keyItems.length,
        sceneFeaturesCount: elements.sceneFeatures.length,
        storyboardsCount: elements.storyboardSummaries.length,
      };
    }

    return info;
  };

  // 处理用户发送消息
  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    addMessage('user', content);

    // 根据当前步骤调用对应的处理函数
    switch (step) {
      case 0:
        await handleStepOne(content);
        break;
      case 1:
        await handleStepTwo(content);
        break;
      case 2:
        await handleStepThree(content);
        break;
      default:
        addMessage('assistant', '未知的步骤');
    }
  };

  // 上下文信息卡片组件
  const ContextInfoCard: React.FC<{ contextInfo: StepContextInfo }> = ({ contextInfo }) => {
    if (!contextInfo.step1 && !contextInfo.step2) {
      return null;
    }

    return (
      <div style={{ padding: '12px', backgroundColor: '#fff' }}>
        <Collapse defaultActiveKey={[]}>
          <Collapse.Panel key="context" title="📋 基于前序步骤的内容">
            <div style={{ fontSize: '13px', padding: '8px', lineHeight: '1.6' }}>
              {contextInfo.step1 && (
                <div style={{ marginBottom: contextInfo.step2 ? '12px' : 0 }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>📖 故事提示：</strong>
                    <span style={{ color: '#595959' }}>{contextInfo.step1.prompt}</span>
                  </div>
                  <div>
                    <strong>📝 故事概要：</strong>
                    <span style={{ color: '#595959' }}>{contextInfo.step1.summaryPreview}</span>
                  </div>
                </div>
              )}
              {contextInfo.step2 && (
                <div>
                  <strong>🎭 核心元素：</strong>
                  <span style={{ color: '#595959' }}>
                    {contextInfo.step2.charactersCount} 个人物、
                    {contextInfo.step2.keyItemsCount} 个物品、
                    {contextInfo.step2.sceneFeaturesCount} 个场景、
                    {contextInfo.step2.storyboardsCount} 个分镜
                  </span>
                </div>
              )}
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  };

  // 根据步骤生成不同的占位符文本
  const getPlaceholder = () => {
    switch (step) {
      case 0:
        return '请输入故事提示，例如：一只勇敢的小兔子去森林探险...';
      case 1:
        return '输入任意内容开始生成核心元素...';
      case 2:
        return '输入任意内容开始生成分镜详情...';
      default:
        return '请输入消息...';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 上下文信息卡片 */}
      {step > 0 && <ContextInfoCard contextInfo={getContextInfo()} />}

      {/* 聊天框 */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <ChatBox
          messages={stepMessages[step] || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder={getPlaceholder()}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default StepChat;
