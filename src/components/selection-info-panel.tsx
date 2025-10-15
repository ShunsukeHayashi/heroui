import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { GenerationModal } from "./generation-modal";

export const SelectionInfoPanel: React.FC = () => {
  const { generationContext } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [initialTab, setInitialTab] = React.useState<"image" | "video">("image");
  
  if (generationContext.selectionType === "none") {
    return null;
  }
  
  // Get icon based on selection type
  const getSelectionIcon = () => {
    switch (generationContext.selectionType) {
      case "text":
        return "lucide:text";
      case "image":
        return "lucide:image";
      case "shape":
        return "lucide:square";
      case "text+image":
        return "lucide:file-text";
      case "text+shape":
        return "lucide:pen-tool";
      case "image+shape":
        return "lucide:layers";
      case "mixed":
        return "lucide:layers";
      default:
        return "lucide:mouse-pointer";
    }
  };
  
  const handleOpenModal = (tab: "image" | "video") => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 shadow-md animate-fadeIn">
        <CardBody className="py-2 px-3 flex items-center gap-3">
          <Icon icon={getSelectionIcon()} className="text-primary" />
          
          <div>
            <p className="text-sm font-medium">
              {generationContext.selectionType === "text" ? "テキスト" : 
               generationContext.selectionType === "image" ? "画像" :
               generationContext.selectionType === "shape" ? "図形" :
               generationContext.selectionType === "text+image" ? "テキスト+画像" :
               generationContext.selectionType === "text+shape" ? "テキスト+図形" :
               generationContext.selectionType === "image+shape" ? "画像+図形" :
               "複数要素"} 選択中
            </p>
            <p className="text-xs text-default-500">
              {generationContext.text.length > 0 && `${generationContext.text.length} テキスト • `}
              {generationContext.images.length > 0 && `${generationContext.images.length} 画像 • `}
              {generationContext.shapes.length > 0 && `${generationContext.shapes.length} 図形`}
            </p>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              color="primary" 
              variant="flat"
              startContent={<Icon icon="lucide:image" className="text-sm" />}
              onPress={() => handleOpenModal("image")}
            >
              画像生成
            </Button>
            
            <Button 
              size="sm" 
              color="secondary" 
              variant="flat"
              startContent={<Icon icon="lucide:video" className="text-sm" />}
              onPress={() => handleOpenModal("video")}
            >
              動画生成
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <GenerationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={initialTab}
        generationType="selection"
      />
    </>
  );
};