import React from "react";
import { Button, Card, CardBody, Tooltip, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CanvasElement } from "../types/canvas-element";
import { useProjectContext } from "../contexts/ProjectContext";

interface MultiElementToolbarProps {
  selectedElements: CanvasElement[];
}

export const MultiElementToolbar: React.FC<MultiElementToolbarProps> = ({ selectedElements }) => {
  const { deleteElement } = useProjectContext();
  
  // Check what types of elements are selected
  const hasImages = selectedElements.some(el => el.type === "image");
  const hasVideos = selectedElements.some(el => el.type === "video");
  const hasText = selectedElements.some(el => el.type === "text");
  const multipleSelected = selectedElements.length > 1;
  
  const handleDelete = () => {
    // Delete all selected elements
    selectedElements.forEach(element => {
      if (deleteElement) {
        deleteElement(element.id);
      }
    });
  };
  
  const handleGroup = () => {
    console.log("Group elements:", selectedElements.map(el => el.id));
  };
  
  const handleAlign = (alignment: string) => {
    console.log(`Align ${alignment}:`, selectedElements.map(el => el.id));
  };
  
  const handleDistribute = (direction: string) => {
    console.log(`Distribute ${direction}:`, selectedElements.map(el => el.id));
  };
  
  const handleCombine = () => {
    // Different actions based on selected element types
    if (hasImages && hasText) {
      console.log("Combine text and images:", selectedElements.map(el => el.id));
    } else if (hasImages && hasVideos) {
      console.log("Combine images and videos:", selectedElements.map(el => el.id));
    } else if (hasImages && selectedElements.length > 1) {
      console.log("Combine multiple images:", selectedElements.map(el => el.id));
    }
  };

  return (
    <Card className="shadow-md">
      <CardBody className="py-1 px-1 flex items-center gap-1">
        {/* Move/Transform */}
        <Tooltip content="Move Together">
          <Button size="sm" isIconOnly variant="light">
            <Icon icon="lucide:move" className="text-sm" />
          </Button>
        </Tooltip>
        
        {/* Group/Ungroup - only for multiple elements */}
        {multipleSelected && (
          <Tooltip content="Group Elements">
            <Button size="sm" isIconOnly variant="light" onPress={handleGroup}>
              <Icon icon="lucide:group" className="text-sm" />
            </Button>
          </Tooltip>
        )}
        
        {/* Alignment options - only for multiple elements */}
        {multipleSelected && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button size="sm" isIconOnly variant="light">
                <Icon icon="lucide:align-center" className="text-sm" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2 w-48">
                <p className="text-xs text-default-500 mb-2">Align</p>
                <div className="grid grid-cols-3 gap-1">
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("left")}>
                    <Icon icon="lucide:align-left" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("center-h")}>
                    <Icon icon="lucide:align-center-horizontal" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("right")}>
                    <Icon icon="lucide:align-right" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("top")}>
                    <Icon icon="lucide:align-start-vertical" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("center-v")}>
                    <Icon icon="lucide:align-center-vertical" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleAlign("bottom")}>
                    <Icon icon="lucide:align-end-vertical" className="text-sm" />
                  </Button>
                </div>
                
                <p className="text-xs text-default-500 mt-3 mb-2">Distribute</p>
                <div className="grid grid-cols-2 gap-1">
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleDistribute("horizontal")}>
                    <Icon icon="lucide:separator-horizontal" className="text-sm" />
                  </Button>
                  <Button size="sm" isIconOnly variant="flat" onPress={() => handleDistribute("vertical")}>
                    <Icon icon="lucide:separator-vertical" className="text-sm" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Combine/Merge - show different options based on selected elements */}
        {multipleSelected && (
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button size="sm" isIconOnly variant="light" color="primary">
                <Icon icon="lucide:combine" className="text-sm" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="p-2 w-64">
                <p className="text-xs text-default-500 mb-2">Combine Elements</p>
                <div className="space-y-1">
                  {hasImages && hasImages && selectedElements.length > 1 && (
                    <Button 
                      size="sm" 
                      variant="flat" 
                      className="w-full justify-start"
                      onPress={handleCombine}
                      startContent={<Icon icon="lucide:images" className="text-sm" />}
                    >
                      Combine Images
                    </Button>
                  )}
                  
                  {hasImages && hasVideos && (
                    <Button 
                      size="sm" 
                      variant="flat" 
                      className="w-full justify-start"
                      onPress={handleCombine}
                      startContent={<Icon icon="lucide:film" className="text-sm" />}
                    >
                      Create Media Collage
                    </Button>
                  )}
                  
                  {hasText && hasImages && (
                    <Button 
                      size="sm" 
                      variant="flat" 
                      className="w-full justify-start"
                      onPress={handleCombine}
                      startContent={<Icon icon="lucide:text" className="text-sm" />}
                    >
                      Add Text to Image
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Layer ordering */}
        <Tooltip content="Bring to Front">
          <Button size="sm" isIconOnly variant="light">
            <Icon icon="lucide:move-up" className="text-sm" />
          </Button>
        </Tooltip>
        
        <Tooltip content="Send to Back">
          <Button size="sm" isIconOnly variant="light">
            <Icon icon="lucide:move-down" className="text-sm" />
          </Button>
        </Tooltip>
        
        {/* Delete all selected */}
        <Tooltip content="Delete" color="danger">
          <Button size="sm" isIconOnly variant="light" color="danger" onPress={handleDelete}>
            <Icon icon="lucide:trash-2" className="text-sm" />
          </Button>
        </Tooltip>
      </CardBody>
    </Card>
  );
};