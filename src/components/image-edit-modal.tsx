import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Textarea,
  Input,
  Slider,
  Switch,
  Divider,
  Tooltip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { editImage } from "../utils/ark-api";
import { GenerationResult } from "../types/generation-result";

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceImage?: GenerationResult;
}

export const ImageEditModal: React.FC<ImageEditModalProps> = ({ 
  isOpen, 
  onClose,
  sourceImage
}) => {
  const { addGenerationResult } = useProjectContext();
  const [prompt, setPrompt] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState(sourceImage?.url || "");
  const [apiKey, setApiKey] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState(21);
  const [guidanceScale, setGuidanceScale] = React.useState(5.5);
  const [watermark, setWatermark] = React.useState(true);
  const [useRandomSeed, setUseRandomSeed] = React.useState(false);
  
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && sourceImage) {
      setImageUrl(sourceImage.url);
      setPrompt("");
      setError(null);
      setGenerationProgress(0);
      setSeed(21);
      setGuidanceScale(5.5);
      setWatermark(true);
      setUseRandomSeed(false);
    }
  }, [isOpen, sourceImage]);
  
  // Handle image editing
  const handleEditImage = async () => {
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
      setError("編集内容を記述するプロンプトが必要です");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(10);
    setError(null);
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);
      
      // Use random seed if selected
      const actualSeed = useRandomSeed ? Math.floor(Math.random() * 1000000) : seed;
      
      // Call the API
      const result = await editImage({
        apiKey,
        prompt,
        imageUrl,
        seed: actualSeed,
        guidanceScale,
        watermark
      });
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Create generation result
      const generationResult: GenerationResult = {
        id: `edit-${Date.now()}`,
        type: "image",
        url: result.url,
        prompt: prompt,
        model: "seededit-3-0-i2i",
        width: result.width || 1024,
        height: result.height || 1024,
        timestamp: new Date(),
        cost: 0.02,
        mode: "i2i",
        sourceImageUrl: imageUrl
      };
      
      // Add to generation history
      addGenerationResult(generationResult);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
    } catch (err) {
      console.error("Image editing failed:", err);
      setError(err instanceof Error ? err.message : "画像編集に失敗しました");
      setIsGenerating(false);
      setGenerationProgress(0);
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
                <Icon icon="lucide:edit-3" className="text-primary" />
                <span>画像を編集</span>
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
                
                {/* Source Image */}
                <div>
                  <p className="text-sm font-medium mb-2">元の画像</p>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <Input
                        label="画像URL"
                        placeholder="編集する画像のURLを入力"
                        value={imageUrl}
                        onValueChange={setImageUrl}
                        isRequired
                      />
                    </div>
                    {imageUrl && (
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-default-100 flex-shrink-0">
                        <img 
                          src={imageUrl} 
                          alt="元の画像" 
                          className="w-full h-full object-cover"
                          onError={() => setError("画像の読み込みに失敗しました")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Edit Prompt */}
                <Textarea
                  label="編集プロンプト"
                  placeholder="例: 背景を青空に変更する、人物の服を赤色に変える..."
                  value={prompt}
                  onValueChange={setPrompt}
                  minRows={3}
                  isRequired
                />
                
                <Divider />
                
                {/* Advanced Settings */}
                <div>
                  <p className="text-sm font-medium mb-2">詳細設定</p>
                  
                  {/* Seed Setting */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">シード値: {useRandomSeed ? "ランダム" : seed}</p>
                      <Switch 
                        size="sm"
                        isSelected={useRandomSeed}
                        onValueChange={setUseRandomSeed}
                      >
                        <span className="text-xs">ランダム</span>
                      </Switch>
                    </div>
                    <Slider 
                      size="sm"
                      step={1}
                      minValue={0}
                      maxValue={1000000}
                      value={seed}
                      onChange={(value) => setSeed(Number(value))}
                      isDisabled={useRandomSeed}
                      className="max-w-full"
                    />
                  </div>
                  
                  {/* Guidance Scale */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Tooltip content="プロンプトの影響力を調整します。高いほどプロンプトに忠実になりますが、画像の品質が低下する場合があります。">
                        <p className="text-sm flex items-center gap-1">
                          ガイダンススケール: {guidanceScale.toFixed(1)}
                          <Icon icon="lucide:info" className="text-xs text-default-400" />
                        </p>
                      </Tooltip>
                    </div>
                    <Slider 
                      size="sm"
                      step={0.1}
                      minValue={1}
                      maxValue={10}
                      value={guidanceScale}
                      onChange={(value) => setGuidanceScale(Number(value))}
                      className="max-w-full"
                    />
                  </div>
                  
                  {/* Watermark Toggle */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm">ウォーターマーク</p>
                    <Switch 
                      isSelected={watermark}
                      onValueChange={setWatermark}
                    />
                  </div>
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
                    <span>画像を編集中...</span>
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
                    color="primary"
                    onPress={handleEditImage}
                    isDisabled={!prompt.trim() || !imageUrl || !apiKey}
                    startContent={<Icon icon="lucide:wand-2" />}
                  >
                    画像を編集
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