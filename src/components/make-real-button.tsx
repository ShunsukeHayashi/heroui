import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { GenerationModal } from "./generation-modal";

export const MakeRealButton: React.FC = () => {
  const { generationContext } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [initialTab, setInitialTab] = React.useState<"image" | "video">("image");
  
  // Determine if the button should be enabled based on selection
  const hasSelection = generationContext.selectionType !== "none";
  
  const handleOpenModal = (tab: "image" | "video") => {
    setInitialTab(tab);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <div className="flex gap-2">
        <Tooltip 
          content={hasSelection ? "Generate image from selection" : "Select elements first"} 
          placement="bottom"
        >
          <div>
            <Button
              color="primary"
              size="lg"
              className="px-4 py-2 font-medium shadow-sm"
              startContent={<Icon icon="lucide:image" className="text-lg" />}
              onPress={() => handleOpenModal("image")}
              isDisabled={!hasSelection}
            >
              Make Image
            </Button>
          </div>
        </Tooltip>
        
        <Tooltip 
          content={hasSelection ? "Generate video from selection" : "Select elements first"} 
          placement="bottom"
        >
          <div>
            <Button
              color="secondary"
              size="lg"
              className="px-4 py-2 font-medium shadow-sm"
              startContent={<Icon icon="lucide:video" className="text-lg" />}
              onPress={() => handleOpenModal("video")}
              isDisabled={!hasSelection}
            >
              Make Video
            </Button>
          </div>
        </Tooltip>
        
        <Tooltip 
          content={hasSelection ? "Choose generation type" : "Select elements first"} 
          placement="bottom"
        >
          <div>
            <Button
              variant="flat"
              size="lg"
              className="px-4 py-2 font-medium shadow-sm"
              startContent={<Icon icon="lucide:sparkles" className="text-lg" />}
              onPress={() => handleOpenModal("image")}
              isDisabled={!hasSelection}
            >
              Make Real
            </Button>
          </div>
        </Tooltip>
      </div>
      
      <GenerationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={initialTab}
      />
    </>
  );
};