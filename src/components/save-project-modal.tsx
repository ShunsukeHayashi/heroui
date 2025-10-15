import React from "react";
import { 
  Button, 
  Input, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader,
  Textarea
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ 
  isOpen, 
  onClose,
  onSaved
}) => {
  const { currentProject, saveProject } = useProjectContext();
  const [projectName, setProjectName] = React.useState(currentProject?.name || "Untitled Project");
  const [description, setDescription] = React.useState(currentProject?.description || "");
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setProjectName(currentProject?.name || "Untitled Project");
      setDescription(currentProject?.description || "");
    }
  }, [isOpen, currentProject]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Take canvas snapshot and save project
      await saveProject({
        name: projectName,
        description,
        lastModified: new Date(),
        // In a real implementation, we would capture the canvas state here
        canvasSnapshot: "canvas-snapshot-data-placeholder",
      });
      
      onSaved();
    } catch (error) {
      console.error("Failed to save project:", error);
      // In a real implementation, we would show an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:save" className="text-primary" />
                Save Project
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  value={projectName}
                  onValueChange={setProjectName}
                  variant="bordered"
                  isRequired
                  startContent={<Icon icon="lucide:file" className="text-default-400" />}
                />
                
                <Textarea
                  label="Description (optional)"
                  placeholder="Add a description for your project"
                  value={description}
                  onValueChange={setDescription}
                  variant="bordered"
                  minRows={3}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSave}
                isLoading={isSaving}
                isDisabled={!projectName.trim()}
              >
                Save Project
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};