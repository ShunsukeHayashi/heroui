import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";

interface TldrawCanvasProps {
  projectId: string;
  activeTool: "select" | "pen" | "text" | "shape" | "image";
}

export const TldrawCanvas: React.FC<TldrawCanvasProps> = ({ projectId: _projectId, activeTool }) => {
  const { setGenerationContext } = useProjectContext();
  const [selectedElement, setSelectedElement] = React.useState<{
    id: string;
    type: "image" | "text" | "shape" | "video";
    position: { x: number; y: number };
    imageUrl?: string;
  } | null>(null);
  const [elements, setElements] = React.useState([
    { id: "img1", type: "image", x: 100, y: 150, width: 300, height: 200, imageUrl: "https://img.heroui.chat/image/landscape?w=300&h=200&u=1" },
    { id: "txt1", type: "text", x: 400, y: 150, width: 200, height: 50, text: "ドローンの空撮映像" },
    { id: "shp1", type: "shape", x: 600, y: 150, width: 100, height: 100, shape: "rectangle" }
  ]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const canvasRef = React.useRef<HTMLDivElement>(null);
  
  // Handle element selection
  const handleElementClick = (element: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({
      id: element.id,
      type: element.type,
      position: { x: element.x, y: element.y },
      imageUrl: element.imageUrl
    });
    
    // Update generation context based on selection
    if (element.type === "text") {
      setGenerationContext({
        // @ts-ignore - TODO: Fix tldraw type compatibility for text data structure
        text: [{ id: element.id, content: element.text }],
        images: [],
        shapes: [],
        combinedText: element.text,
        selectionType: "text"
      });
    } else if (element.type === "image") {
      setGenerationContext({
        text: [],
        // @ts-ignore - TODO: Fix tldraw ImageData type compatibility
        images: [{ id: element.id, url: element.imageUrl }],
        shapes: [],
        combinedText: "",
        selectionType: "image"
      });
    } else if (element.type === "shape") {
      setGenerationContext({
        text: [],
        images: [],
        // @ts-ignore - TODO: Fix tldraw ShapeData type compatibility
        shapes: [{ id: element.id, type: element.shape }],
        combinedText: "",
        selectionType: "shape"
      });
    }
  };
  
  // Start dragging an element
  const handleElementMouseDown = (element: any, e: React.MouseEvent) => {
    if (activeTool !== "select") return;
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setSelectedElement({
      id: element.id,
      type: element.type,
      position: { x: element.x, y: element.y },
      imageUrl: element.imageUrl
    });
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragOffset({ x: dx, y: dy });
    
    // Update element position in real-time
    setElements(prev => 
      prev.map(el => 
        el.id === selectedElement.id 
          ? { ...el, x: selectedElement.position.x + dx, y: selectedElement.position.y + dy }
          : el
      )
    );
  };
  
  // End dragging
  const handleMouseUp = () => {
    if (isDragging && selectedElement) {
      // Finalize the position
      setElements(prev => 
        prev.map(el => 
          el.id === selectedElement.id 
            ? { ...el, x: selectedElement.position.x + dragOffset.x, y: selectedElement.position.y + dragOffset.y }
            : el
        )
      );
      
      // Reset dragging state
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  };
  
  // Clear selection when clicking on canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "canvas-area") {
      setSelectedElement(null);
      setGenerationContext({
        text: [],
        images: [],
        shapes: [],
        combinedText: "",
        selectionType: "none"
      });
    }
  };
  
  // Add a new element based on active tool
  const handleCanvasDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id !== "canvas-area") return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newId = `elem-${Date.now()}`;
    
    let newElement;
    
    switch (activeTool) {
      case "text":
        newElement = {
          id: newId,
          type: "text",
          x,
          y,
          width: 200,
          height: 50,
          text: "新しいテキスト"
        };
        break;
      case "shape":
        newElement = {
          id: newId,
          type: "shape",
          x,
          y,
          width: 100,
          height: 100,
          shape: "rectangle"
        };
        break;
      case "image":
        // In a real app, this would open a file picker
        newElement = {
          id: newId,
          type: "image",
          x,
          y,
          width: 300,
          height: 200,
          imageUrl: `https://img.heroui.chat/image/landscape?w=300&h=200&u=${Math.floor(Math.random() * 10)}`
        };
        break;
      default:
        return;
    }
    
    setElements(prev => [...prev, newElement]);
  };
  
  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElement) return;
    
    setElements(prev => prev.filter(el => el.id !== selectedElement.id));
    setSelectedElement(null);
    setGenerationContext({
      text: [],
      images: [],
      shapes: [],
      combinedText: "",
      selectionType: "none"
    });
  };
  
  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteElement();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement]);
  
  return (
    <div 
      id="canvas-area"
      ref={canvasRef}
      className="w-full h-full relative"
      onClick={handleCanvasClick}
      onDoubleClick={handleCanvasDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Canvas elements */}
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute cursor-move ${
            selectedElement?.id === element.id ? "ring-2 ring-primary" : ""
          }`}
          style={{ 
            left: element.x, 
            top: element.y,
            width: element.width,
            height: element.height
          }}
          onClick={(e) => handleElementClick(element, e)}
          onMouseDown={(e) => handleElementMouseDown(element, e)}
        >
          {element.type === "image" && (
            <img 
              src={element.imageUrl} 
              alt="Canvas element" 
              className="w-full h-full object-cover rounded-md"
              draggable={false}
            />
          )}
          {element.type === "text" && (
            <div className="bg-white p-3 rounded-md shadow-sm w-full h-full flex items-center">
              <p>{element.text}</p>
            </div>
          )}
          {element.type === "shape" && (
            <div className="w-full h-full bg-primary/20 rounded-md flex items-center justify-center">
              <Icon icon="lucide:square" className="text-primary text-2xl" />
            </div>
          )}
          
          {/* Resize handles (only for selected element) */}
          {selectedElement?.id === element.id && (
            <>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nw-resize" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-ne-resize" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-sw-resize" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize" />
            </>
          )}
        </div>
      ))}
      
      {/* Element menu */}
      {selectedElement && (
        <div className="absolute top-2 right-2 z-20">
          <Tooltip content="削除">
            <Button
              size="sm"
              color="danger"
              variant="flat"
              isIconOnly
              onPress={handleDeleteElement}
            >
              <Icon icon="lucide:trash-2" />
            </Button>
          </Tooltip>
        </div>
      )}
      
      {/* Tool instructions */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-content1/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-default-600">
        {activeTool === "select" && "選択ツール: 要素をクリックして選択、ドラッグして移動"}
        {activeTool === "pen" && "ペンツール: ドラッグして線を描画"}
        {activeTool === "text" && "テキストツール: キャンバスをダブルクリックしてテキストを追加"}
        {activeTool === "shape" && "図形ツール: キャンバスをダブルクリックして図形を追加"}
        {activeTool === "image" && "画像ツール: キャンバスをダブルクリックして画像を追加"}
      </div>
    </div>
  );
};