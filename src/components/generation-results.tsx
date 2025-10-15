import React from "react";
import { Card, CardBody, CardFooter, Button, Tooltip, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { GenerationResult } from "../types/generation-result";
import { GenerationPreviewModal } from "./generation-preview-modal";
import { ImageEditModal } from "./image-edit-modal";

export const GenerationResults: React.FC = () => {
  const { generationResults, addToCanvas } = useProjectContext();
  
  if (generationResults.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute bottom-6 right-6 max-w-md max-h-[70vh] overflow-auto">
      <div className="p-2 bg-content1 rounded-xl shadow-md mb-2">
        <p className="text-sm font-medium flex items-center gap-1">
          <Icon icon="lucide:history" className="text-default-500" />
          生成履歴
        </p>
      </div>
      <div className="space-y-4">
        {generationResults.map((result) => (
          <GenerationResultCard 
            key={result.id} 
            result={result}
            onAddToCanvas={() => addToCanvas(result)}
          />
        ))}
      </div>
    </div>
  );
};

interface GenerationResultCardProps {
  result: GenerationResult;
  onAddToCanvas: () => void;
}

const GenerationResultCard: React.FC<GenerationResultCardProps> = ({ result, onAddToCanvas }) => {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  
  // Format the timestamp
  const formattedTime = new Date(result.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <>
      <Card className="w-full shadow-md">
        <CardBody className="p-3">
          <div 
            className="relative cursor-pointer" 
            onClick={() => setIsPreviewOpen(true)}
          >
            {result.type === "image" ? (
              <img 
                src={result.url} 
                alt={result.prompt} 
                className="w-full h-auto rounded-md"
              />
            ) : (
              <div className="relative w-full pt-[56.25%] bg-default-100 rounded-md">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon icon="lucide:video" className="text-4xl text-default-400" />
                  <Button 
                    isIconOnly 
                    size="sm" 
                    className="absolute" 
                    variant="flat"
                  >
                    <Icon icon="lucide:play" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="absolute top-2 right-2">
              <Chip color={result.type === "image" ? "primary" : "secondary"} size="sm">
                {result.type === "image" ? "画像" : "動画"}
              </Chip>
            </div>
            
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <Button 
                size="sm" 
                variant="flat" 
                color="default" 
                className="bg-white/80 backdrop-blur-sm"
              >
                プレビュー
              </Button>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-default-500 line-clamp-2">{result.prompt}</p>
          </div>
        </CardBody>
        
        <CardFooter className="pt-0 pb-3 px-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tooltip content="キャンバスに追加">
              <Button 
                size="sm" 
                isIconOnly 
                variant="flat" 
                color="primary"
                onPress={onAddToCanvas}
              >
                <Icon icon="lucide:plus" />
              </Button>
            </Tooltip>
            
            <Tooltip content="ダウンロード">
              <Button 
                size="sm" 
                isIconOnly 
                variant="flat"
                as="a" 
                href={result.url} 
                download
                target="_blank"
              >
                <Icon icon="lucide:download" />
              </Button>
            </Tooltip>
            
            {/* Add Edit button for images */}
            {result.type === "image" && (
              <Tooltip content="画像を編集">
                <Button 
                  size="sm" 
                  isIconOnly 
                  variant="flat"
                  color="primary"
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <Icon icon="lucide:edit-3" />
                </Button>
              </Tooltip>
            )}
          </div>
          
          <Popover placement="top">
            <PopoverTrigger>
              <Button 
                size="sm" 
                isIconOnly 
                variant="light"
              >
                <Icon icon="lucide:info" className="text-default-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2 w-64">
                <h4 className="text-sm font-medium mb-2">生成詳細</h4>
                <div className="space-y-1 text-xs text-default-600">
                  <p><span className="font-medium">モデル:</span> {result.model}</p>
                  <p><span className="font-medium">サイズ:</span> {result.width}×{result.height}</p>
                  {result.type === "video" && (
                    <p><span className="font-medium">長さ:</span> {result.duration}秒</p>
                  )}
                  <p><span className="font-medium">生成時間:</span> {formattedTime}</p>
                  <p><span className="font-medium">コスト:</span> ${result.cost.toFixed(3)}</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
      
      <GenerationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        result={result}
      />
      
      {/* Add Image Edit Modal */}
      {result.type === "image" && (
        <ImageEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          sourceImage={result}
        />
      )}
    </>
  );
};

const Chip: React.FC<{
  children: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}> = ({ children, color, size = "md" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };
  
  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-2",
    lg: "text-md py-1 px-3",
  };
  
  return (
    <span className={`rounded-full font-medium ${colorClasses[color]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};