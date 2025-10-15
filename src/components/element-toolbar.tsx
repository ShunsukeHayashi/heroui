import React from "react";
import { Button, Card, CardBody, Tooltip, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CanvasElement } from "../types/canvas-element";
import { useProjectContext } from "../contexts/ProjectContext";

interface ElementToolbarProps {
  element: CanvasElement;
  isVisible: boolean;
}

export const ElementToolbar: React.FC<ElementToolbarProps> = ({ element, isVisible }) => {
  const { updateElement, deleteElement } = useProjectContext();
  
  if (!isVisible) return null;
  
  const handleDelete = () => {
    if (deleteElement) {
      deleteElement(element.id);
    }
  };
  
  const handleDuplicate = () => {
    // TODO: This should call a proper function to add the duplicated element to the canvas
    const duplicatedElement = {
      ...element,
      id: `${element.id}-copy-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    };
    // In a real implementation, we would add this to the canvas elements array
    console.log("Duplicated element:", duplicatedElement);

    // Suppress unused variable warning - updateElement would be used in a full implementation
    void updateElement;
  };
  
  const handleBringToFront = () => {
    // In a real implementation, we would update the z-index or layer order
    console.log("Bring to front:", element.id);
  };
  
  const handleSendToBack = () => {
    // In a real implementation, we would update the z-index or layer order
    console.log("Send to back:", element.id);
  };

  return (
    <div 
      className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full -top-2 z-10 animate-fadeIn"
      onClick={(e) => e.stopPropagation()} // Prevent triggering canvas click
    >
      <Card className="shadow-md">
        <CardBody className="py-1 px-1 flex items-center gap-1">
          {/* Common tools for all element types */}
          <Tooltip content="Move">
            <Button size="sm" isIconOnly variant="light">
              <Icon icon="lucide:move" className="text-sm" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Duplicate">
            <Button size="sm" isIconOnly variant="light" onPress={handleDuplicate}>
              <Icon icon="lucide:copy" className="text-sm" />
            </Button>
          </Tooltip>
          
          {/* Text-specific tools */}
          {element.type === "text" && (
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button size="sm" isIconOnly variant="light">
                  <Icon icon="lucide:type" className="text-sm" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2 w-64">
                  <div className="mb-2">
                    <label className="text-xs text-default-500">Font Size</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="sm" variant="flat">S</Button>
                      <Button size="sm" variant="flat">M</Button>
                      <Button size="sm" variant="flat">L</Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-default-500">Style</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="sm" isIconOnly variant="flat">
                        <Icon icon="lucide:bold" />
                      </Button>
                      <Button size="sm" isIconOnly variant="flat">
                        <Icon icon="lucide:italic" />
                      </Button>
                      <Button size="sm" isIconOnly variant="flat">
                        <Icon icon="lucide:underline" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          {/* Image-specific tools */}
          {element.type === "image" && (
            <>
              <Tooltip content="Crop">
                <Button size="sm" isIconOnly variant="light">
                  <Icon icon="lucide:crop" className="text-sm" />
                </Button>
              </Tooltip>
              <Tooltip content="Replace">
                <Button size="sm" isIconOnly variant="light">
                  <Icon icon="lucide:image" className="text-sm" />
                </Button>
              </Tooltip>
            </>
          )}
          
          {/* Layer ordering tools */}
          <Tooltip content="Bring to Front">
            <Button size="sm" isIconOnly variant="light" onPress={handleBringToFront}>
              <Icon icon="lucide:move-up" className="text-sm" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Send to Back">
            <Button size="sm" isIconOnly variant="light" onPress={handleSendToBack}>
              <Icon icon="lucide:move-down" className="text-sm" />
            </Button>
          </Tooltip>
          
          {/* Delete tool */}
          <Tooltip content="Delete" color="danger">
            <Button size="sm" isIconOnly variant="light" color="danger" onPress={handleDelete}>
              <Icon icon="lucide:trash-2" className="text-sm" />
            </Button>
          </Tooltip>
        </CardBody>
      </Card>
    </div>
  );
};