import React from "react";
import { Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Project } from "../types/project";
import { useProjectContext } from "../contexts/ProjectContext";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const { deleteProject } = useProjectContext();
  
  // Format the last modified date
  const formattedDate = React.useMemo(() => {
    const date = new Date(project.lastModified);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }, [project.lastModified]);

  return (
    <Card className="w-full">
      <CardBody>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-default-100 rounded-md flex items-center justify-center overflow-hidden">
            {project.thumbnailUrl ? (
              <img 
                src={project.thumbnailUrl} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon icon="lucide:image" className="text-3xl text-default-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-md font-semibold truncate">{project.name}</h3>
            {project.description && (
              <p className="text-tiny text-default-500 line-clamp-1">{project.description}</p>
            )}
            <p className="text-tiny text-default-400 mt-1">{formattedDate}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => onSelect(project)}
            >
              Open
            </Button>
            
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly
                  size="sm"
                  variant="light"
                >
                  <Icon icon="lucide:more-vertical" className="text-default-500" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Project actions">
                <DropdownItem
                  key="duplicate"
                  startContent={<Icon icon="lucide:copy" className="text-default-500" />}
                >
                  Duplicate
                </DropdownItem>
                <DropdownItem
                  key="export"
                  startContent={<Icon icon="lucide:download" className="text-default-500" />}
                >
                  Export
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={<Icon icon="lucide:trash-2" className="text-danger" />}
                  className="text-danger"
                  onPress={() => deleteProject(project.id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};