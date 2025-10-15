import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Input,
  Textarea,
  Slider,
  Select,
  SelectItem,
  Chip,
  Switch
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { generateImage, generateVideo } from "../utils/generation-utils";
import { generateTextToImage } from "../utils/ark-api";
import { GenerationResult } from "../types/generation-result";

interface GenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "image" | "video";
  generationType?: "selection" | "text";
}

export const GenerationModal: React.FC<GenerationModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = "image",
  generationType = "selection"
}) => {
  const { generationContext, addGenerationResult } = useProjectContext();
  const [activeTab, setActiveTab] = React.useState<"image" | "video">(initialTab);
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [negativePrompt, setNegativePrompt] = React.useState("");
  const [imageModel, setImageModel] = React.useState("sdxl");
  const [videoModel, setVideoModel] = React.useState("svd");
  const [imageSize, setImageSize] = React.useState("1024x1024");
  const [videoLength, setVideoLength] = React.useState(3);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [apiKey, setApiKey] = React.useState("");
  const [useArkApi, setUseArkApi] = React.useState(false);
  const [guidanceScale, setGuidanceScale] = React.useState(3);
  const [watermark, setWatermark] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Update active tab when initialTab prop changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  // Update prompt when selection changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (generationType === "selection" && generationContext.combinedText) {
        setPrompt(generationContext.combinedText);
      } else if (generationType === "text") {
        // Clear prompt for text-to-image/video
        setPrompt("");
      }
    }
  }, [isOpen, generationContext, generationType]);
  
  // Handle generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      let result: GenerationResult;
      
      if (activeTab === "image") {
        if (useArkApi) {
          // Validate API key
          if (!apiKey) {
            clearInterval(progressInterval);
            setError("ARK API キーが必要です");
            setIsGenerating(false);
            return;
          }
          
          // Use ARK API for text-to-image
          try {
            const arkResult = await generateTextToImage({
              apiKey,
              prompt,
              negativePrompt,
              size: imageSize,
              guidanceScale,
              watermark
            });
            
            result = {
              id: `ark-img-${Date.now()}`,
              type: "image",
              url: arkResult.url,
              prompt,
              negativePrompt,
              model: "seedream-3-0-t2i-250415",
              width: arkResult.width,
              height: arkResult.height,
              timestamp: new Date(),
              cost: 0.02, // Estimated cost
              mode: "t2i"
            };
          } catch (err) {
            clearInterval(progressInterval);
            setError(err instanceof Error ? err.message : "ARK API での生成に失敗しました");
            setIsGenerating(false);
            return;
          }
        } else {
          // Use mock generation
          result = await generateImage({
            prompt,
            negativePrompt,
            model: imageModel,
            size: imageSize,
            selectedElements: generationContext
          });
        }
      } else {
        // Video generation (unchanged)
        result = await generateVideo({
          prompt,
          negativePrompt,
          model: videoModel,
          lengthSeconds: videoLength,
          selectedElements: generationContext
        });
      }
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Add result to project context
      addGenerationResult(result);
      
      // Close modal after a short delay to show 100% progress
      setTimeout(() => {
        onClose();
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
      
    } catch (error) {
      console.error("Generation failed:", error);
      setIsGenerating(false);
      setGenerationProgress(0);
      setError("生成に失敗しました。もう一度お試しください。");
    }
  };
  
  // Get selection type info
  const getSelectionInfo = () => {
    if (generationType !== "selection") return null;
    
    const { selectionType, text, images, shapes } = generationContext;
    
    if (selectionType === "none") return null;
    
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {text.length > 0 && (
          <Chip color="primary" variant="flat" startContent={<Icon icon="lucide:text" />}>
            {text.length} テキスト
          </Chip>
        )}
        {images.length > 0 && (
          <Chip color="secondary" variant="flat" startContent={<Icon icon="lucide:image" />}>
            {images.length} 画像
          </Chip>
        )}
        {shapes.length > 0 && (
          <Chip color="success" variant="flat" startContent={<Icon icon="lucide:square" />}>
            {shapes.length} 図形
          </Chip>
        )}
      </div>
    );
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
                {activeTab === "image" ? (
                  <Icon icon="lucide:image" className="text-primary" />
                ) : (
                  <Icon icon="lucide:video" className="text-secondary" />
                )}
                {generationType === "selection" ? (
                  <span>選択から{activeTab === "image" ? "画像" : "動画"}を生成</span>
                ) : (
                  <span>テキストから{activeTab === "image" ? "画像" : "動画"}を生成</span>
                )}
              </div>
            </ModalHeader>
            
            <ModalBody>
              {getSelectionInfo()}
              
              <Tabs 
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as "image" | "video")}
                aria-label="生成オプション"
                className="mb-4"
              >
                <Tab key="image" title="画像生成">
                  <div className="space-y-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">ARK API を使用</p>
                        <p className="text-xs text-default-500">seedream-3-0-t2i-250415 モデルを使用</p>
                      </div>
                      <Switch 
                        isSelected={useArkApi}
                        onValueChange={setUseArkApi}
                      />
                    </div>
                    
                    {useArkApi && (
                      <Input
                        type="password"
                        label="ARK API キー"
                        placeholder="ARK API キーを入力"
                        value={apiKey}
                        onValueChange={setApiKey}
                        isRequired
                        startContent={<Icon icon="lucide:key" className="text-default-400" />}
                      />
                    )}
                    
                    {!useArkApi && (
                      <Select
                        label="モデル"
                        selectedKeys={[imageModel]}
                        onChange={(e) => setImageModel(e.target.value)}
                      >
                        <SelectItem key="sdxl">Stable Diffusion XL</SelectItem>
                        <SelectItem key="sd3">Stable Diffusion 3</SelectItem>
                        <SelectItem key="dalle3">DALL-E 3</SelectItem>
                        <SelectItem key="midjourney">Midjourney</SelectItem>
                      </Select>
                    )}
                    
                    <Select
                      label="サイズ"
                      selectedKeys={[imageSize]}
                      onChange={(e) => setImageSize(e.target.value)}
                    >
                      <SelectItem key="1024x1024">1024 × 1024 (正方形)</SelectItem>
                      <SelectItem key="1024x1792">1024 × 1792 (縦長)</SelectItem>
                      <SelectItem key="1792x1024">1792 × 1024 (横長)</SelectItem>
                    </Select>
                    
                    {useArkApi && (
                      <>
                        <div>
                          <p className="text-sm mb-2">ガイダンススケール: {guidanceScale.toFixed(1)}</p>
                          <Slider 
                            size="sm"
                            step={0.1}
                            minValue={1}
                            maxValue={10}
                            value={guidanceScale}
                            onChange={(value) => setGuidanceScale(Number(value))}
                            className="max-w-md"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm">ウォーターマーク</p>
                          <Switch 
                            isSelected={watermark}
                            onValueChange={setWatermark}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Tab>
                
                <Tab key="video" title="動画生成">
                  <div className="space-y-4 py-2">
                    <Select
                      label="モデル"
                      selectedKeys={[videoModel]}
                      onChange={(e) => setVideoModel(e.target.value)}
                    >
                      <SelectItem key="svd">Stable Video Diffusion</SelectItem>
                      <SelectItem key="gen2">Runway Gen-2</SelectItem>
                      <SelectItem key="pika">Pika Labs</SelectItem>
                    </Select>
                    
                    <div>
                      <p className="text-sm mb-2">動画の長さ: {videoLength} 秒</p>
                      <Slider 
                        size="sm"
                        step={1}
                        minValue={1}
                        maxValue={10}
                        value={videoLength}
                        onChange={(value) => setVideoLength(Number(value))}
                        className="max-w-md"
                      />
                    </div>
                  </div>
                </Tab>
              </Tabs>
              
              <Textarea
                label="プロンプト"
                placeholder={generationType === "selection" ? "選択した要素から生成する内容を詳細に記述..." : "生成したい内容を詳細に記述..."}
                value={prompt}
                onValueChange={setPrompt}
                minRows={3}
                className="mb-4"
              />
              
              <Textarea
                label="ネガティブプロンプト (オプション)"
                placeholder="生成で避けたい要素..."
                value={negativePrompt}
                onValueChange={setNegativePrompt}
                minRows={2}
              />
              
              {error && (
                <div className="mt-4 p-2 bg-danger-50 text-danger border border-danger-200 rounded-md">
                  <p className="text-sm flex items-center gap-1">
                    <Icon icon="lucide:alert-circle" />
                    {error}
                  </p>
                </div>
              )}
            </ModalBody>
            
            <ModalFooter>
              {isGenerating ? (
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-2">
                    <span>{activeTab === "image" ? "画像" : "動画"}を生成中...</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-default-100 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <Button variant="flat" onPress={onClose}>
                    キャンセル
                  </Button>
                  <Button 
                    color={activeTab === "image" ? "primary" : "secondary"}
                    onPress={handleGenerate}
                    isDisabled={!prompt.trim()}
                    startContent={<Icon icon={activeTab === "image" ? "lucide:image" : "lucide:video"} />}
                  >
                    {activeTab === "image" ? "画像" : "動画"}を生成
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