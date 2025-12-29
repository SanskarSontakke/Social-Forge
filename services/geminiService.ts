import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, ImageSize, AspectRatio, Platform } from "../types";

// Helper to determine aspect ratio based on platform if Auto is selected
const getAspectRatioForPlatform = (platform: Platform, selectedRatio: AspectRatio): string => {
  if (selectedRatio !== AspectRatio.Auto) {
    return selectedRatio;
  }
  switch (platform) {
    case 'linkedin': return '1:1'; // Square
    case 'twitter': return '16:9'; // Landscape standard
    case 'instagram': return '3:4'; // Vertical portrait
    default: return '1:1';
  }
};

// Ensure the ratio is strictly supported by gemini-2.5-flash-image
const validateAspectRatio = (ratio: string): string => {
  const supported = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  if (supported.includes(ratio)) return ratio;
  
  // Map unsupported ratios to nearest supported neighbors
  if (ratio === '2:3') return '3:4';
  if (ratio === '3:2') return '4:3';
  if (ratio === '21:9') return '16:9';
  
  return '1:1';
};

// Helper to get style modifiers based on platform, tone, AND size
const getStyleModifiers = (platform: Platform, tone: string, size: ImageSize): string => {
  const platformStyles = {
    linkedin: "Professional photography, polished corporate aesthetic, clean composition, high definition, trusted business style",
    twitter: "Eye-catching, bold graphic design, high contrast, viral visual style, punchy and dynamic",
    instagram: "Aesthetic lifestyle photography, cinematic lighting, visually stunning, trending instagram style, highly detailed"
  };

  const toneStyles: Record<string, string> = {
    Professional: "minimalist, sophisticated, neutral color palette, authoritative, sharp focus, elegant, office vibe",
    Witty: "vibrant colors, playful, quirky, pop art elements, fun, energetic, creative composition, bright",
    Urgent: "dramatic lighting, bold red or orange accents, high impact, intense, action-oriented, motion blur elements",
    Empathetic: "soft golden hour lighting, warm tones, shallow depth of field, gentle, emotional, authentic, human-centric",
    Controversial: "gritty texture, moody chiaroscuro lighting, stark contrast, edgy, provocative, unconventional angles, dark atmosphere"
  };

  const sizeModifiers: Record<ImageSize, string> = {
    [ImageSize.Size1K]: "highly detailed, sharp focus, high quality, standard definition",
    [ImageSize.Size2K]: "2k resolution, incredibly detailed, crisp, high fidelity, enhanced textures",
    [ImageSize.Size4K]: "4k resolution, ultra high definition, intricate details, masterpiece, best quality, hyperrealistic"
  };

  const selectedPlatformStyle = platformStyles[platform];
  const selectedToneStyle = toneStyles[tone] || toneStyles['Professional'];
  const selectedSizeModifier = sizeModifiers[size] || sizeModifiers[ImageSize.Size1K];

  return `${selectedPlatformStyle}, ${selectedToneStyle}, ${selectedSizeModifier}, photorealistic`;
};

export const generateSocialContent = async (idea: string, tone: string): Promise<GeneratedContent> => {
  // Initialize client here to use the latest available API Key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-flash-preview as the standard free/efficient model for text
  const modelId = "gemini-3-flash-preview";

  const postSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "The main text body of the post." },
      imagePrompt: { type: Type.STRING, description: "A detailed, vivid prompt to generate a high-quality image for this post." },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant hashtags." }
    },
    required: ["content", "imagePrompt", "hashtags"]
  };

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      linkedin: postSchema,
      twitter: postSchema,
      instagram: postSchema
    },
    required: ["linkedin", "twitter", "instagram"]
  };

  const prompt = `
    You are an expert social media manager. 
    Create content for a user's idea: "${idea}".
    Tone: ${tone}.
    
    1. LinkedIn: Professional, long-form, insightful, structured with paragraphs.
    2. Twitter/X: Short, punchy, under 280 chars, engaging.
    3. Instagram: Visual-focused caption, engaging hook, clean formatting.
    
    For each, provide the text content, a specific image generation prompt tailored to the platform's visual style, and hashtags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a world-class social media strategist and copywriter.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini.");

    return JSON.parse(jsonText) as GeneratedContent;
  } catch (error) {
    console.error("Error generating text content:", error);
    throw error;
  }
};

export const generateImageForPlatform = async (
  platform: Platform,
  prompt: string,
  tone: string,
  settings: { size: ImageSize, aspectRatio: AspectRatio }
): Promise<string> => {
  // Initialize client here
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // FIXED: Strictly use 'gemini-2.5-flash-image' (Nano Banana).
  // This model is free-tier friendly and avoids the 403 PERMISSION_DENIED errors.
  const modelId = "gemini-2.5-flash-image";
  
  let ratio = getAspectRatioForPlatform(platform, settings.aspectRatio);
  ratio = validateAspectRatio(ratio);
  
  // Apply style modifiers based on tone, platform, AND size
  const styleModifiers = getStyleModifiers(platform, tone, settings.size);
  
  // Clean up the prompt slightly to ensure it's optimized for the image model
  const enhancedPrompt = `${prompt}. ${styleModifiers}`;

  // Note: 'imageSize' is NOT supported by gemini-2.5-flash-image, so we must omit it.
  // Sending it would cause errors or be ignored, but omitting it is the correct usage.
  const imageConfig = {
    aspectRatio: ratio,
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: enhancedPrompt,
      config: {
        imageConfig
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error: any) {
    console.error(`Error generating image for ${platform}:`, error);
    // Enhance error message for 403
    if (error.message?.includes("403") || error.status === 403 || error.code === 403) {
      throw new Error("Permission denied. The free model may be overloaded or your key is invalid.");
    }
    throw error;
  }
};