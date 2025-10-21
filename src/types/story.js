"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyboardDetailsSchema = exports.storyElementsSchema = exports.storySummarySchema = exports.storyboardDetailSchema = exports.storyboardSummarySchema = exports.sceneFeatureSchema = exports.keyItemSchema = exports.characterSchema = void 0;
const zod_1 = require("zod");
// ============================================================================
// Zod Schemas（用于 AI generateObject）
// ============================================================================
// 关键人物 Schema
exports.characterSchema = zod_1.z.object({
    id: zod_1.z.string().describe('唯一标识符'),
    name: zod_1.z.string().describe('人物姓名'),
    appearance: zod_1.z.string().describe('外貌描述，包括年龄、身高、体型、面容特征等'),
    clothing: zod_1.z.string().describe('衣物描述，包括衣服款式、颜色、配饰等'),
    personality: zod_1.z.string().describe('性格特征，包括主要性格、行为特点等'),
});
// 关键物品 Schema
exports.keyItemSchema = zod_1.z.object({
    id: zod_1.z.string().describe('唯一标识符'),
    name: zod_1.z.string().describe('物品名称'),
    description: zod_1.z.string().describe('物品的基本描述'),
    features: zod_1.z.string().describe('物品的关键特征，包括外观、材质、功能等'),
});
// 场景特征 Schema
exports.sceneFeatureSchema = zod_1.z.object({
    id: zod_1.z.string().describe('唯一标识符'),
    name: zod_1.z.string().describe('场景名称'),
    environment: zod_1.z.string().describe('环境描述，包括地点、周围事物、环境特点等'),
    time: zod_1.z.string().describe('时间，如白天、夜晚、清晨、黄昏等'),
    atmosphere: zod_1.z.string().describe('氛围描述，如温馨、神秘、紧张、欢快等'),
});
// 分镜概要 Schema
exports.storyboardSummarySchema = zod_1.z.object({
    id: zod_1.z.string().describe('唯一标识符'),
    sequence: zod_1.z.number().describe('分镜序号，从1开始'),
    sceneDescription: zod_1.z.string().describe('场景描述，包括场景、人物动作、关键事件'),
    dialogue: zod_1.z.string().optional().describe('对话内容（可选）'),
});
// 分镜详情 Schema
exports.storyboardDetailSchema = zod_1.z.object({
    id: zod_1.z.string().describe('唯一标识符'),
    summaryId: zod_1.z.string().describe('关联的分镜概要ID'),
    detailedDescription: zod_1.z.string().describe('详细的场景描述，包括所有细节'),
    cameraAngle: zod_1.z.string().describe('镜头角度，如近景、远景、特写、俯视、仰视等'),
    characterActions: zod_1.z.string().describe('人物的具体动作和表情'),
    visualElements: zod_1.z.string().describe('视觉元素，包括光线、色调、构图等'),
});
// 第一步：故事概要 Schema
exports.storySummarySchema = zod_1.z.object({
    summary: zod_1.z.string().describe('故事概要，包括故事背景、主要情节、主题思想等'),
});
// 第二步：核心元素 Schema
exports.storyElementsSchema = zod_1.z.object({
    characters: zod_1.z.array(exports.characterSchema).describe('关键人物列表'),
    keyItems: zod_1.z.array(exports.keyItemSchema).describe('关键物品列表'),
    sceneFeatures: zod_1.z.array(exports.sceneFeatureSchema).describe('场景特征列表'),
    storyboardSummaries: zod_1.z.array(exports.storyboardSummarySchema).describe('分镜概要列表'),
});
// 第三步：分镜详情 Schema
exports.storyboardDetailsSchema = zod_1.z.object({
    details: zod_1.z.array(exports.storyboardDetailSchema).describe('分镜详情列表'),
});
//# sourceMappingURL=story.js.map