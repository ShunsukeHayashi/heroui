import { GenerationContext } from "../types/generation-context";
import { GenerationResult } from "../types/generation-result";
import { generateTextToImage } from "./ark-api";

interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  size: string;
  selectedElements?: GenerationContext;
}

interface VideoGenerationParams {
  prompt: string;
  negativePrompt?: string;
  model: string;
  lengthSeconds: number;
  selectedElements?: GenerationContext;
}

// Mock image generation function
export const generateImage = async (params: ImageGenerationParams): Promise<GenerationResult> => {
  // In a real implementation, this would call an API
  console.log("Generating image with params:", params);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Parse size
  const [width, height] = params.size.split("x").map(Number);
  
  // Determine mode based on selected elements
  const mode = params.selectedElements && 
    (params.selectedElements.images.length > 0 || params.selectedElements.shapes.length > 0) 
    ? "i2i" : "t2i";
  
  // Return mock result
  return {
    id: `img-${Date.now()}`,
    type: "image",
    url: `https://img.heroui.chat/image/${getRandomCategory()}?w=${width}&h=${height}&u=${Math.floor(Math.random() * 100)}`,
    prompt: params.prompt,
    negativePrompt: params.negativePrompt,
    model: params.model,
    width,
    height,
    timestamp: new Date(),
    cost: 0.01 + Math.random() * 0.05,
    mode
  };
};

// Mock video generation function
export const generateVideo = async (params: VideoGenerationParams): Promise<GenerationResult> => {
  // In a real implementation, this would call an API
  console.log("Generating video with params:", params);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Determine mode based on selected elements
  const mode = params.selectedElements && 
    (params.selectedElements.images.length > 0 || params.selectedElements.shapes.length > 0) 
    ? "i2v" : "t2v";
  
  // Return mock result - using image URL as placeholder since we can't generate real videos
  return {
    id: `vid-${Date.now()}`,
    type: "video",
    // In a real implementation, this would be a video URL
    url: `https://img.heroui.chat/image/${getRandomCategory()}?w=1280&h=720&u=${Math.floor(Math.random() * 100)}`,
    prompt: params.prompt,
    negativePrompt: params.negativePrompt,
    model: params.model,
    width: 1280,
    height: 720,
    duration: params.lengthSeconds,
    timestamp: new Date(),
    cost: 0.05 + Math.random() * 0.1,
    mode
  };
};

// Helper function to get a random image category
function getRandomCategory(): string {
  const categories = [
    "landscape", "ai", "places", "movie", "game"
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

// Export the ARK API function for direct use
export { generateTextToImage };
