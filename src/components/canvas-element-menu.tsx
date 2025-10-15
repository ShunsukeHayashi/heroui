import React from "react";
import { Button, ButtonGroup, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";

interface CanvasElementMenuProps {
  elementId: string;
  elementType: "image" | "text" | "shape" | "video";
  position: { x: number; y: number };
  imageUrl?: string;
}

export const CanvasElementMenu: React.FC<CanvasElementMenuProps> = ({
  elementId,
  elementType,
  position,
  imageUrl
}) => {
  const { setGenerationContext } = useProjectContext();
  
  const handleGenerateFromElement = (type: "image" | "video") => {
    // Set generation context based on element type
    if (elementType === "text") {
      setGenerationContext({
        // @ts-ignore - TODO: Fix tldraw type compatibility for text data structure
        text: [{ id: elementId, content: "テキスト内容" }], // In a real app, get actual text
        images: [],
        shapes: [],
        combinedText: "テキスト内容",
        selectionType: "text"
      });
    } else if (elementType === "image") {
      setGenerationContext({
        text: [],
        // @ts-ignore - TODO: Fix tldraw TLShapeId type compatibility
        images: [{ id: elementId, url: imageUrl || "" }],
        shapes: [],
        combinedText: "",
        selectionType: "image"
      });
    } else if (elementType === "shape") {
      setGenerationContext({
        text: [],
        images: [],
        // @ts-ignore - TODO: Fix tldraw TLShapeId type compatibility
        shapes: [{ id: elementId, type: "rectangle" }], // In a real app, get actual shape type
        combinedText: "",
        selectionType: "shape"
      });
    }
    
    // In a real app, open generation modal here
    console.log(`Generate ${type} from ${elementType} element:`, elementId);
  };
  
  return (
    <div 
      className="absolute z-10 bg-content1 rounded-lg shadow-md p-1"
      style={{ 
        left: position.x, 
        top: position.y - 50,
      }}
    >
      <ButtonGroup size="sm" variant="flat">
        <Tooltip content="画像生成">
          <Button 
            isIconOnly 
            color="primary"
            onPress={() => handleGenerateFromElement("image")}
          >
            <Icon icon="lucide:image" />
          </Button>
        </Tooltip>
        
        <Tooltip content="動画生成">
          <Button 
            isIconOnly 
            color="secondary"
            onPress={() => handleGenerateFromElement("video")}
          >
            <Icon icon="lucide:video" />
          </Button>
        </Tooltip>
        
        <Tooltip content="編集">
          <Button isIconOnly>
            <Icon icon="lucide:edit" />
          </Button>
        </Tooltip>
        
        <Tooltip content="削除">
          <Button isIconOnly color="danger">
            <Icon icon="lucide:trash-2" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};