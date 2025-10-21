import { z } from 'zod';
export interface StorySummary {
    prompt: string;
    summary: string;
}
export interface Character {
    id: string;
    name: string;
    appearance: string;
    clothing: string;
    personality: string;
}
export interface KeyItem {
    id: string;
    name: string;
    description: string;
    features: string;
}
export interface SceneFeature {
    id: string;
    name: string;
    environment: string;
    time: string;
    atmosphere: string;
}
export interface StoryboardSummary {
    id: string;
    sequence: number;
    sceneDescription: string;
    dialogue?: string;
}
export interface StoryboardDetail {
    id: string;
    summaryId: string;
    detailedDescription: string;
    cameraAngle: string;
    characterActions: string;
    visualElements: string;
}
export interface StepTwoData {
    characters: Character[];
    keyItems: KeyItem[];
    sceneFeatures: SceneFeature[];
    storyboardSummaries: StoryboardSummary[];
}
export interface StoryData {
    summary: StorySummary | null;
    elements: StepTwoData | null;
    details: StoryboardDetail[] | null;
}
export type MessageRole = 'user' | 'assistant' | 'system';
export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    data?: any;
    isError?: boolean;
}
export interface StepChatState {
    messages: ChatMessage[];
    isLoading: boolean;
    error?: string;
}
export declare const characterSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    appearance: z.ZodString;
    clothing: z.ZodString;
    personality: z.ZodString;
}, z.core.$strip>;
export declare const keyItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    features: z.ZodString;
}, z.core.$strip>;
export declare const sceneFeatureSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    environment: z.ZodString;
    time: z.ZodString;
    atmosphere: z.ZodString;
}, z.core.$strip>;
export declare const storyboardSummarySchema: z.ZodObject<{
    id: z.ZodString;
    sequence: z.ZodNumber;
    sceneDescription: z.ZodString;
    dialogue: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const storyboardDetailSchema: z.ZodObject<{
    id: z.ZodString;
    summaryId: z.ZodString;
    detailedDescription: z.ZodString;
    cameraAngle: z.ZodString;
    characterActions: z.ZodString;
    visualElements: z.ZodString;
}, z.core.$strip>;
export declare const storySummarySchema: z.ZodObject<{
    summary: z.ZodString;
}, z.core.$strip>;
export declare const storyElementsSchema: z.ZodObject<{
    characters: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        appearance: z.ZodString;
        clothing: z.ZodString;
        personality: z.ZodString;
    }, z.core.$strip>>;
    keyItems: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        features: z.ZodString;
    }, z.core.$strip>>;
    sceneFeatures: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        environment: z.ZodString;
        time: z.ZodString;
        atmosphere: z.ZodString;
    }, z.core.$strip>>;
    storyboardSummaries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        sequence: z.ZodNumber;
        sceneDescription: z.ZodString;
        dialogue: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const storyboardDetailsSchema: z.ZodObject<{
    details: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        summaryId: z.ZodString;
        detailedDescription: z.ZodString;
        cameraAngle: z.ZodString;
        characterActions: z.ZodString;
        visualElements: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export interface StepContextInfo {
    step1?: {
        prompt: string;
        summaryPreview: string;
    };
    step2?: {
        charactersCount: number;
        keyItemsCount: number;
        sceneFeaturesCount: number;
        storyboardsCount: number;
    };
}
//# sourceMappingURL=story.d.ts.map