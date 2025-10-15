/**
 * ARK API utilities for image-to-video generation
 */

// ARK API base URL
const API_BASE_URL = "https://ark.ap-southeast-1.bytepluses.com/api/v3/contents/generations";

// ARK API base URL for images
const IMAGES_API_BASE_URL = "https://ark.ap-southeast.bytepluses.com/api/v3/images/generations";

/**
 * Create an image-to-video generation task
 */
export async function createImageToVideoTask(
  apiKey: string,
  prompt: string,
  imageUrl: string
): Promise<{ id: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "seedance-1-0-pro-250528",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "タスクの作成に失敗しました");
    }

    const data = await response.json();
    return { id: data.id };
  } catch (error) {
    console.error("Error creating image-to-video task:", error);
    throw error;
  }
}

/**
 * Check the status of a generation task
 */
export async function checkTaskStatus(
  taskId: string,
  apiKey: string
): Promise<{
  status: "processing" | "succeeded" | "failed";
  result?: { url: string };
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "タスクステータスの確認に失敗しました");
    }

    const data = await response.json();
    
    // Parse the response based on task status
    if (data.status === "succeeded") {
      return {
        status: "succeeded",
        result: {
          url: data.result?.output?.video_url || ""
        }
      };
    } else if (data.status === "failed") {
      return {
        status: "failed",
        error: data.error?.message || "不明なエラーが発生しました"
      };
    } else {
      return {
        status: "processing"
      };
    }
  } catch (error) {
    console.error("Error checking task status:", error);
    throw error;
  }
}

/**
 * Edit an image using the ARK API
 */
interface EditImageParams {
  apiKey: string;
  prompt: string;
  imageUrl: string;
  seed?: number;
  guidanceScale?: number;
  watermark?: boolean;
  size?: string;
}

interface EditImageResult {
  url: string;
  width?: number;
  height?: number;
}

export async function editImage(params: EditImageParams): Promise<EditImageResult> {
  try {
    const response = await fetch("https://ark.ap-southeast-1.bytepluses.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${params.apiKey}`
      },
      body: JSON.stringify({
        model: "seededit-3-0-i2i-250628",
        prompt: params.prompt,
        image: params.imageUrl,
        response_format: "url",
        size: params.size || "adaptive",
        seed: params.seed || 21,
        guidance_scale: params.guidanceScale || 5.5,
        watermark: params.watermark !== undefined ? params.watermark : true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "画像編集に失敗しました");
    }

    const data = await response.json();
    
    // Extract the image URL from the response
    return {
      url: data.data[0].url,
      width: data.data[0].width,
      height: data.data[0].height
    };
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
}

/**
 * Generate an image using the ARK API text-to-image model
 */
interface TextToImageParams {
  apiKey: string;
  prompt: string;
  negativePrompt?: string;
  size?: string;
  guidanceScale?: number;
  watermark?: boolean;
}

interface TextToImageResult {
  url: string;
  width: number;
  height: number;
}

export async function generateTextToImage(params: TextToImageParams): Promise<TextToImageResult> {
  try {
    const response = await fetch(IMAGES_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${params.apiKey}`
      },
      body: JSON.stringify({
        model: "seedream-3-0-t2i-250415",
        prompt: params.prompt,
        negative_prompt: params.negativePrompt,
        response_format: "url",
        size: params.size || "1024x1024",
        guidance_scale: params.guidanceScale || 3,
        watermark: params.watermark !== undefined ? params.watermark : true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "画像生成に失敗しました");
    }

    const data = await response.json();
    
    // Extract the image URL from the response
    return {
      url: data.data[0].url,
      width: data.data[0].width,
      height: data.data[0].height
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}