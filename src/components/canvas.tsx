import React from "react";
import { Card, CardBody, Button, ButtonGroup, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { TldrawCanvas } from "./tldraw-canvas";
import { SelectionInfoPanel } from "./selection-info-panel";
import { GenerationResults } from "./generation-results";
import { CreativeToolbar } from "./creative-toolbar";
import { MakeRealButton } from "./make-real-button";
import { CanvasToolbar } from "./canvas-toolbar";

export const Canvas: React.FC = () => {
  const { currentProject } = useProjectContext();
  const [zoom, setZoom] = React.useState(1);
  const [showGrid, setShowGrid] = React.useState(true);
  const [activeTool, setActiveTool] = React.useState<"select" | "pen" | "text" | "shape" | "image">("select");
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-content2 rounded-lg">
      {currentProject ? (
        <div className="relative w-full h-full">
          {/* Canvas area with zoom control */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className={`w-full h-full transform origin-center transition-transform duration-200 ${showGrid ? 'bg-grid' : ''}`}
              style={{ transform: `scale(${zoom})` }}
            >
              <TldrawCanvas 
                projectId={currentProject.id} 
                activeTool={activeTool}
              />
            </div>
          </div>
          
          {/* Show selection info panel when elements are selected */}
          <SelectionInfoPanel />
          
          {/* Top toolbar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <CanvasToolbar 
              activeTool={activeTool} 
              onChangeTool={setActiveTool} 
            />
          </div>
          
          {/* Right sidebar for generation tools */}
          <div className="absolute top-4 right-4 z-10">
            <MakeRealButton />
          </div>
          
          {/* Bottom toolbar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <Card className="shadow-md">
              <CardBody className="py-2 px-3 flex items-center gap-3">
                <ButtonGroup size="sm" variant="flat">
                  <Tooltip content="ズームアウト">
                    <Button isIconOnly onPress={handleZoomOut}>
                      <Icon icon="lucide:minus" />
                    </Button>
                  </Tooltip>
                  <Button onPress={handleResetZoom}>
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Tooltip content="ズームイン">
                    <Button isIconOnly onPress={handleZoomIn}>
                      <Icon icon="lucide:plus" />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                
                <Tooltip content={showGrid ? "グリッド非表示" : "グリッド表示"}>
                  <Button 
                    size="sm" 
                    variant="flat" 
                    isIconOnly
                    onPress={() => setShowGrid(!showGrid)}
                    className={showGrid ? "bg-default-100" : ""}
                  >
                    <Icon icon="lucide:grid" />
                  </Button>
                </Tooltip>
                
                <Tooltip content="キャンバスをリセット">
                  <Button 
                    size="sm" 
                    variant="flat" 
                    isIconOnly
                    color="danger"
                  >
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </Tooltip>
              </CardBody>
            </Card>
          </div>
          
          {/* Add Generation Results */}
          <GenerationResults />
          
          {/* Left sidebar for creative tools */}
          <div className="absolute top-4 left-4 z-10">
            <CreativeToolbar />
          </div>
        </div>
      ) : (
        <Card className="w-96 max-w-full">
          <CardBody className="flex flex-col items-center justify-center py-8">
            <p className="text-default-500 text-center">
              プロジェクトが読み込まれていません。新規プロジェクトを作成するか、既存のプロジェクトを開いてください。
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};