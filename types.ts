export type Platform = 'linkedin' | 'twitter' | 'instagram';

export type Tone = 'Professional' | 'Witty' | 'Urgent' | 'Empathetic' | 'Controversial';

export enum ImageSize {
  Size1K = '1K',
  Size2K = '2K',
  Size4K = '4K',
}

export enum AspectRatio {
  Auto = 'Auto',
  Square_1_1 = '1:1',
  Portrait_2_3 = '2:3',
  Landscape_3_2 = '3:2',
  Portrait_3_4 = '3:4',
  Landscape_4_3 = '4:3',
  Portrait_9_16 = '9:16',
  Landscape_16_9 = '16:9',
  Ultrawide_21_9 = '21:9',
}

export interface SocialPost {
  platform: Platform;
  content: string;
  imagePrompt: string;
  hashtags: string[];
}

export interface GeneratedContent {
  linkedin: SocialPost;
  twitter: SocialPost;
  instagram: SocialPost;
}

export interface GenerationState {
  isGeneratingText: boolean;
  isGeneratingImages: boolean;
  error?: string;
  content?: GeneratedContent;
  images?: Record<Platform, string>; // base64 strings
}

export interface Settings {
  tone: Tone;
  imageSize: ImageSize;
  aspectRatio: AspectRatio;
}