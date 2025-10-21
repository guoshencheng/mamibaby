import { Router, Request, Response, NextFunction, IRouter } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { streamText, stepCountIs } from 'ai';
import { alicloud, getModelName, validateAIConfig } from '../config/ai';
import type { CoreMessage } from 'ai';

// 导入前端的类型和提示词
import {
  storySummarySchema,
  storyElementsSchema,
  storyboardDetailsSchema,
} from '../../src/types/story.js';

import {
  STEP1_SYSTEM_PROMPT,
  STEP1_USER_PROMPT,
  STEP2_SYSTEM_PROMPT,
  STEP2_USER_PROMPT,
  STEP3_SYSTEM_PROMPT,
  STEP3_USER_PROMPT,
  fillPrompt,
} from '../../src/prompts/storyPrompts.js';

const router: IRouter = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 验证 AI 配置
const checkAIConfig = () => {
  const configCheck = validateAIConfig();
  if (!configCheck.valid) {
    throw new AppError(configCheck.error || 'AI 配置错误', 500);
  }
};

// 生成故事概要
router.post(
  '/summary',
  [
    body('prompt').trim().notEmpty().withMessage('故事提示不能为空'),
    body('historyMessages').isArray().optional(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('请求参数错误', 400);
      }

      checkAIConfig();

      const { prompt, historyMessages = [] } = req.body;

      const userPrompt = fillPrompt(STEP1_USER_PROMPT, { prompt });

      let capturedSummary: string | null = null;

      const messages: CoreMessage[] = [
        ...historyMessages,
        { role: 'user', content: userPrompt },
      ];

      const result = streamText({
        model: alicloud(getModelName()),
        system: STEP1_SYSTEM_PROMPT,
        messages,
        stopWhen: stepCountIs(20),
        tools: {
          submitStorySummary: {
            description: '提交生成的故事概要。',
            inputSchema: storySummarySchema,
            execute: async (params: { summary: string }) => {
              capturedSummary = params.summary;
              return {
                success: true,
                message: '故事概要已成功保存。',
              };
            },
          },
        },
      });

      // 设置流式响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 流式传输文本
      for await (const chunk of result.textStream) {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
      }

      // 等待完成
      await result.text;

      // 发送最终数据
      if (capturedSummary) {
        res.write(
          `data: ${JSON.stringify({
            type: 'result',
            data: { prompt, summary: capturedSummary },
          })}\n\n`
        );
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

// 生成核心元素
router.post(
  '/elements',
  [
    body('summary').isObject().notEmpty().withMessage('故事概要不能为空'),
    body('historyMessages').isArray().optional(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('请求参数错误', 400);
      }

      checkAIConfig();

      const { summary, historyMessages = [] } = req.body;

      const userPrompt = fillPrompt(STEP2_USER_PROMPT, {
        summary: summary.summary,
      });

      let capturedElements: any = null;

      const messages: CoreMessage[] = [
        ...historyMessages,
        { role: 'user', content: userPrompt },
      ];

      const result = streamText({
        model: alicloud(getModelName()),
        system: STEP2_SYSTEM_PROMPT,
        messages,
        stopWhen: [stepCountIs(20)],
        tools: {
          submitStoryElements: {
            description: '提交生成的故事核心元素。',
            inputSchema: storyElementsSchema,
            execute: async (params: any) => {
              capturedElements = {
                characters: params.characters,
                keyItems: params.keyItems,
                sceneFeatures: params.sceneFeatures,
                storyboardSummaries: params.storyboardSummaries,
              };
              return {
                success: true,
                message: '核心元素已成功保存。',
              };
            },
          },
        },
      });

      // 设置流式响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 流式传输文本
      for await (const chunk of result.textStream) {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
      }

      // 等待完成
      await result.text;

      // 发送最终数据
      if (capturedElements) {
        res.write(
          `data: ${JSON.stringify({
            type: 'result',
            data: capturedElements,
          })}\n\n`
        );
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

// 生成分镜详情
router.post(
  '/details',
  [
    body('summaries').isArray().notEmpty().withMessage('分镜概要列表不能为空'),
    body('elements').isObject().notEmpty().withMessage('核心元素不能为空'),
    body('historyMessages').isArray().optional(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError('请求参数错误', 400);
      }

      checkAIConfig();

      const { summaries, elements, historyMessages = [] } = req.body;

      // 格式化数据
      const summariesText = summaries
        .map(
          (s: any) =>
            `[分镜${s.sequence}] ${s.sceneDescription}${
              s.dialogue ? ` - 对话："${s.dialogue}"` : ''
            }`
        )
        .join('\n');

      const charactersText = elements.characters
        .map(
          (c: any) =>
            `【${c.name}】\n- 外貌：${c.appearance}\n- 衣物：${c.clothing}\n- 性格：${c.personality}`
        )
        .join('\n\n');

      const keyItemsText = elements.keyItems
        .map(
          (i: any) =>
            `【${i.name}】\n- 描述：${i.description}\n- 特征：${i.features}`
        )
        .join('\n\n');

      const sceneFeaturesText = elements.sceneFeatures
        .map(
          (s: any) =>
            `【${s.name}】\n- 环境：${s.environment}\n- 时间：${s.time}\n- 氛围：${s.atmosphere}`
        )
        .join('\n\n');

      const userPrompt = fillPrompt(STEP3_USER_PROMPT, {
        storyboardSummaries: summariesText,
        characters: charactersText,
        keyItems: keyItemsText,
        sceneFeatures: sceneFeaturesText,
      });

      let capturedDetails: any = null;

      const messages: CoreMessage[] = [
        ...historyMessages,
        { role: 'user', content: userPrompt },
      ];

      const result = streamText({
        model: alicloud(getModelName()),
        system: STEP3_SYSTEM_PROMPT,
        stopWhen: stepCountIs(20),
        messages,
        tools: {
          submitStoryboardDetails: {
            description: '提交生成的分镜详情列表。',
            inputSchema: storyboardDetailsSchema,
            execute: async (params: { details: any[] }) => {
              capturedDetails = params.details;
              return {
                success: true,
                message: '分镜详情已成功保存。',
              };
            },
          },
        },
      });

      // 设置流式响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // 流式传输文本
      for await (const chunk of result.textStream) {
        res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
      }

      // 等待完成
      await result.text;

      // 发送最终数据
      if (capturedDetails) {
        res.write(
          `data: ${JSON.stringify({
            type: 'result',
            data: capturedDetails,
          })}\n\n`
        );
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;

