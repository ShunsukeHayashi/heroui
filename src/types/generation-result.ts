export interface GenerationResult {
  id: string;
  type: "image" | "video";
  url: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  width: number;
  height: number;
  duration?: number; // For videos
  timestamp: Date;
  cost: number;
  mode: "t2i" | "i2i" | "t2v" | "i2v"; // Added mode field
  sourceImageUrl?: string; // Added for edited images
}