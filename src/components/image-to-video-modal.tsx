import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Slider,
  Switch,
  Input,
  Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { createImageToVideoTask, checkTaskStatus } from "../utils/ark-api";
import { GenerationResult } from "../types/generation-result";

interface ImageToVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImageUrl?: string;
}

export const ImageToVideoModal: React.FC<ImageToVideoModalProps> = ({ 
  isOpen, 
  onClose,
  selectedImageUrl
}) => {
  const { addGenerationResult } = useProjectContext();
  const [prompt, setPrompt] = React.useState("");
  const [duration, setDuration] = React.useState(5);
  const [resolution, setResolution] = React.useState("1080p");
  const [cameraFixed, setCameraFixed] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(selectedImageUrl || "");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [taskId, setTaskId] = React.useState<string | null>(null);
  const [apiKey, setApiKey] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  
  // Update image URL when selectedImageUrl changes
  React.useEffect(() => {
    if (selectedImageUrl) {
      setImageUrl(selectedImageUrl);
    }
  }, [selectedImageUrl]);
  
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPrompt("At breakneck speed, drones thread through intricate obstacles or stunning natural wonders, delivering an immersive, heart-pounding flying experience.");
      setDuration(5);
      setResolution("1080p");
      setCameraFixed(false);
      setError(null);
      setGenerationProgress(0);
      setTaskId(null);
    }
  }, [isOpen]);
  
  // Poll for task status when taskId is set
  React.useEffect(() => {
    let intervalId: number | null = null;
    
    if (taskId && isGenerating) {
      intervalId = window.setInterval(async () => {
        try {
          const status = await checkTaskStatus(taskId, apiKey);
          
          if (status.status === "succeeded") {
            // Task completed successfully
            clearInterval(intervalId!);
            setIsGenerating(false);
            setGenerationProgress(100);
            
            // Add result to generation history
            const result: GenerationResult = {
              id: taskId,
              type: "video",
              url: status.result?.url || "",
              prompt: prompt,
              model: "seedance-1-0-pro",
              width: resolution === "1080p" ? 1920 : 1280,
              height: resolution === "1080p" ? 1080 : 720,
              duration: duration,
              timestamp: new Date(),
              cost: 0.1, // Placeholder cost
              mode: "i2v"
            };
            
            addGenerationResult(result);
            
            // Close modal after a short delay
            setTimeout(() => {
              onClose();
            }, 1000);
          } else if (status.status === "failed") {
            // Task failed
            clearInterval(intervalId!);
            setIsGenerating(false);
            setError(status.error || "生成に失敗しました");
          } else if (status.status === "processing") {
            // Task is still processing
            setGenerationProgress(Math.min(95, generationProgress + 5));
          }
        } catch (err) {
          console.error("Failed to check task status:", err);
          setError("タスクステータスの確認に失敗しました");
          clearInterval(intervalId!);
          setIsGenerating(false);
        }
      }, 3000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [taskId, isGenerating, apiKey, addGenerationResult, prompt, resolution, duration, generationProgress, onClose]);
  
  // Handle generation
  const handleGenerate = async () => {
    // Validate inputs
    if (!apiKey) {
      setError("ARK API キーが必要です");
      return;
    }
    
    if (!imageUrl) {
      setError("画像URLが必要です");
      return;
    }
    
    if (!prompt.trim()) {
      setError("プロンプトが必要です");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(5);
    setError(null);
    
    try {
      // Create image-to-video task
      const formattedPrompt = `${prompt} --resolution ${resolution} --duration ${duration} --camerafixed ${cameraFixed}`;
      
      const task = await createImageToVideoTask(
        apiKey,
        formattedPrompt,
        imageUrl
      );
      
      setTaskId(task.id);
      setGenerationProgress(10);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("タスクの作成に失敗しました");
      setIsGenerating(false);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => !isGenerating && onClose()}
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:clapperboard" className="text-secondary" />
                <span>画像から動画を生成</span>
              </div>
            </ModalHeader>
            
            <ModalBody>
              <div className="space-y-4">
                {/* API Key Input */}
                <Input
                  type="password"
                  label="ARK API キー"
                  placeholder="ARK API キーを入力"
                  value={apiKey}
                  onValueChange={setApiKey}
                  isRequired
                  startContent={<Icon icon="lucide:key" className="text-default-400" />}
                />
                
                {/* Image URL Input */}
                <div>
                  <p className="text-sm font-medium mb-2">入力画像</p>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        label="画像URL"
                        placeholder="画像のURLを入力"
                        value={imageUrl}
                        onValueChange={setImageUrl}
                        isRequired
                      />
                    </div>
                    {imageUrl && (
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-default-100 flex-shrink-0">
                        <img 
                          src={imageUrl} 
                          alt="入力画像" 
                          className="w-full h-full object-cover"
                          onError={() => setError("画像の読み込みに失敗しました")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Prompt Input */}
                <Textarea
                  label="プロンプト"
                  placeholder="生成する動画の内容を詳細に記述..."
                  value={prompt}
                  onValueChange={setPrompt}
                  minRows={3}
                  isRequired
                />
                
                {/* Duration Slider */}
                <div>
                  <p className="text-sm font-medium mb-2">動画の長さ: {duration} 秒</p>
                  <Slider 
                    size="sm"
                    step={1}
                    minValue={1}
                    maxValue={10}
                    value={duration}
                    onChange={(value) => setDuration(Number(value))}
                    className="max-w-md"
                  />
                </div>
                
                {/* Resolution Selection */}
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium">解像度:</p>
                  <div className="flex gap-2">
                    <Chip 
                      color={resolution === "720p" ? "primary" : "default"}
                      variant={resolution === "720p" ? "solid" : "flat"}
                      className="cursor-pointer"
                      onClick={() => setResolution("720p")}
                    >
                      720p
                    </Chip>
                    <Chip 
                      color={resolution === "1080p" ? "primary" : "default"}
                      variant={resolution === "1080p" ? "solid" : "flat"}
                      className="cursor-pointer"
                      onClick={() => setResolution("1080p")}
                    >
                      1080p
                    </Chip>
                  </div>
                </div>
                
                {/* Camera Fixed Switch */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">カメラ固定</p>
                  <Switch 
                    isSelected={cameraFixed}
                    onValueChange={setCameraFixed}
                  />
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="p-2 bg-danger-50 text-danger border border-danger-200 rounded-md">
                    <p className="text-sm flex items-center gap-1">
                      <Icon icon="lucide:alert-circle" />
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </ModalBody>
            
            <ModalFooter>
              {isGenerating ? (
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span>動画を生成中...</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-default-100 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-default-500 mt-2 text-center">
                    処理には数分かかることがあります
                  </p>
                </div>
              ) : (
                <>
                  <Button variant="flat" onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button 
                    color="secondary"
                    onPress={handleGenerate}
                    isDisabled={!prompt.trim() || !imageUrl || !apiKey}
                    startContent={<Icon icon="lucide:video" />}
                  >
                    動画を生成
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};