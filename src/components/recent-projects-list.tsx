import React from "react";
import { Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { formatTimeAgo } from "../utils/date-utils";

export const RecentProjectsList: React.FC = () => {
  const { projects, loadProject } = useProjectContext();
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-default-500">
        <Icon icon="lucide:folder" className="text-4xl mb-2 mx-auto" />
        <p>プロジェクトがありません</p>
        <p className="text-sm">「新規プロジェクト」ボタンをクリックして始めましょう</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="w-full">
          <CardBody className="p-4">
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
                <p className="text-tiny text-default-400 mt-1">{formatTimeAgo(project.lastModified)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => loadProject(project.id)}
                >
                  開く
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
                      複製
                    </DropdownItem>
                    <DropdownItem
                      key="export"
                      startContent={<Icon icon="lucide:download" className="text-default-500" />}
                    >
                      エクスポート
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      startContent={<Icon icon="lucide:trash-2" className="text-danger" />}
                      className="text-danger"
                    >
                      削除
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};