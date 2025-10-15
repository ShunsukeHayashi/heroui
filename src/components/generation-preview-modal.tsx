import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Tooltip,
  Divider,
  Chip
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { GenerationResult } from "../types/generation-result";
import { ImageEditModal } from "./image-edit-modal";

interface GenerationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GenerationResult;
}

export const GenerationPreviewModal: React.FC<GenerationPreviewModalProps> = ({ 
  isOpen, 
  onClose,
  result
}) => {
  const { addToCanvas } = useProjectContext();
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // Handle video play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Handle regeneration
  const handleRegenerate = () => {
    // In a real implementation, we would call the generation API with the same parameters
    console.log("Regenerating with same parameters:", result.prompt);
    // For demo purposes, we'll just close the modal
    onClose();
  };
  
  // Handle edit and regenerate
  const handleEditAndRegenerate = () => {
    // In a real implementation, we would open the generation modal with the current parameters
    console.log("Edit and regenerate:", result.prompt);
    // For demo purposes, we'll just close the modal
    onClose();
  };
  
  // Format the timestamp
  const formattedTime = new Date(result.timestamp).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  
  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size={isFullScreen ? "full" : "3xl"}
        className={isFullScreen ? "h-screen" : ""}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon={result.type === "image" ? "lucide:image" : "lucide:video"} className="text-primary" />
                    <span>{result.type === "image" ? "生成画像" : "生成動画"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content={isFullScreen ? "全画面解除" : "全画面表示"}>
                      <Button 
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setIsFullScreen(!isFullScreen)}
                      >
                        <Icon icon={isFullScreen ? "lucide:minimize-2" : "lucide:maximize-2"} />
                      </Button>
                    </Tooltip>
                    <Button 
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={onClose}
                    >
                      <Icon icon="lucide:x" />
                    </Button>
                  </div>
                </div>
              </ModalHeader>
              
              <ModalBody className={isFullScreen ? "flex-grow flex flex-col items-center justify-center" : ""}>
                <div className={`relative ${isFullScreen ? "h-full flex items-center justify-center" : ""}`}>
                  {result.type === "image" ? (
                    <img 
                      src={result.url} 
                      alt={result.prompt} 
                      className={`w-full h-auto rounded-lg object-contain ${isFullScreen ? "max-h-[80vh]" : "max-h-[60vh]"}`}
                    />
                  ) : (
                    <div className="relative w-full pt-[56.25%] bg-default-100 rounded-lg overflow-hidden">
                      <video 
                        ref={videoRef}
                        src={result.url}
                        className="absolute inset-0 w-full h-full object-contain"
                        controls={!isPlaying}
                        onEnded={() => setIsPlaying(false)}
                      />
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            isIconOnly 
                            size="lg" 
                            className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                            onPress={togglePlay}
                          >
                            <Icon icon="lucide:play" className="text-2xl" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {!isFullScreen && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-medium mb-1">プロンプト</h3>
                      <p className="text-sm text-default-600 bg-default-50 p-2 rounded-md">
                        {result.prompt}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Chip color="primary" variant="flat" size="sm">
                        {result.model}
                      </Chip>
                      <Chip color="default" variant="flat" size="sm">
                        {result.width}×{result.height}
                      </Chip>
                      {result.type === "video" && (
                        <Chip color="secondary" variant="flat" size="sm">
                          {result.duration}秒
                        </Chip>
                      )}
                      <Chip color="success" variant="flat" size="sm">
                        ${result.cost.toFixed(3)}
                      </Chip>
                    </div>
                    
                    <div className="flex justify-between text-xs text-default-500">
                      <span>生成時間: {formattedTime}</span>
                      <span>生成モード: {result.mode}</span>
                    </div>
                    
                    {/* Add source image info if this is an edited image */}
                    {result.sourceImageUrl && (
                      <div className="text-xs text-default-500 bg-default-50 p-2 rounded-md">
                        <p className="font-medium mb-1">元画像から編集:</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded overflow-hidden bg-default-100">
                            <img 
                              src={result.sourceImageUrl} 
                              alt="元画像" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="truncate flex-1">{result.sourceImageUrl}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ModalBody>
              
              <Divider />
              
              <ModalFooter>
                <div className="w-full flex flex-wrap justify-between gap-2">
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Icon icon="lucide:plus" />}
                      onPress={() => {
                        addToCanvas(result);
                        onClose();
                      }}
                    >
                      キャンバスに追加
                    </Button>
                    <Button
                      variant="flat"
                      startContent={<Icon icon="lucide:download" />}
                      as="a"
                      href={result.url}
                      download
                      target="_blank"
                    >
                      ダウンロード
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    {/* Add Edit button for images */}
                    {result.type === "image" && (
                      <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="lucide:edit-3" />}
                        onPress={() => setIsEditModalOpen(true)}
                      >
                        画像を編集
                      </Button>
                    )}
                    
                    <Button
                      color="secondary"
                      variant="flat"
                      startContent={<Icon icon="lucide:edit" />}
                      onPress={handleEditAndRegenerate}
                    >
                      編集して再生成
                    </Button>
                    <Button
                      color="primary"
                      startContent={<Icon icon="lucide:refresh-cw" />}
                      onPress={handleRegenerate}
                    >
                      再生成
                    </Button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* Add Image Edit Modal */}
      <ImageEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sourceImage={result}
      />
    </>
  );
};