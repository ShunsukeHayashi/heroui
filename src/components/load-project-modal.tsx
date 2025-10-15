import React from "react";
import { 
  Button, 
  Card, 
  CardBody, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader,
  Tabs,
  Tab,
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { ProjectCard } from "./project-card";
import { Project } from "../types/project";

interface LoadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoadProjectModal: React.FC<LoadProjectModalProps> = ({ isOpen, onClose }) => {
  const { projects, loadProject, createNewProject } = useProjectContext();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("recent");
  
  // Filter projects based on search query
  const filteredProjects = React.useMemo(() => {
    if (!searchQuery) return projects;
    
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);
  
  // Get recent projects (last 5)
  const recentProjects = React.useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5);
  }, [projects]);

  const handleLoadProject = (project: Project) => {
    loadProject(project.id);
    onClose();
  };

  const handleCreateNew = () => {
    createNewProject();
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:folder-open" className="text-primary" />
                Your Projects
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4">
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  startContent={<Icon icon="lucide:search" className="text-default-400" />}
                  isClearable
                  onClear={() => setSearchQuery("")}
                />
              </div>

              <Tabs 
                selectedKey={selectedTab} 
                onSelectionChange={(key) => setSelectedTab(key as string)}
                aria-label="Project tabs"
              >
                <Tab key="recent" title="Recent">
                  {recentProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      {recentProjects.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onSelect={handleLoadProject}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="mt-4">
                      <CardBody className="flex flex-col items-center justify-center py-8">
                        <Icon icon="lucide:file-question" className="text-4xl text-default-300 mb-2" />
                        <p className="text-default-500">No recent projects found</p>
                      </CardBody>
                    </Card>
                  )}
                </Tab>
                <Tab key="all" title="All Projects">
                  {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      {filteredProjects.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onSelect={handleLoadProject}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="mt-4">
                      <CardBody className="flex flex-col items-center justify-center py-8">
                        <Icon icon="lucide:search-x" className="text-4xl text-default-300 mb-2" />
                        <p className="text-default-500">
                          {searchQuery ? "No matching projects found" : "No projects found"}
                        </p>
                      </CardBody>
                    </Card>
                  )}
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                startContent={<Icon icon="lucide:plus" />}
                color="primary"
                variant="flat"
                onPress={handleCreateNew}
              >
                New Project
              </Button>
              <Button onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};