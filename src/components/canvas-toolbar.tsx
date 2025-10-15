import React from "react";
import { Button, ButtonGroup, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CanvasToolbarProps {
  activeTool: "select" | "pen" | "text" | "shape" | "image";
  onChangeTool: (tool: "select" | "pen" | "text" | "shape" | "image") => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ activeTool, onChangeTool }) => {
  return (
    <div className="bg-content1 rounded-lg shadow-md">
      <ButtonGroup variant="flat">
        <Tooltip content="選択ツール (V)" placement="bottom">
          <Button 
            isIconOnly
            color={activeTool === "select" ? "primary" : "default"}
            onPress={() => onChangeTool("select")}
            className="px-4"
          >
            <Icon icon="lucide:mouse-pointer" />
          </Button>
        </Tooltip>
        
        <Tooltip content="ペンツール (P)" placement="bottom">
          <Button 
            isIconOnly
            color={activeTool === "pen" ? "primary" : "default"}
            onPress={() => onChangeTool("pen")}
            className="px-4"
          >
            <Icon icon="lucide:pen" />
          </Button>
        </Tooltip>
        
        <Tooltip content="テキストツール (T)" placement="bottom">
          <Button 
            isIconOnly
            color={activeTool === "text" ? "primary" : "default"}
            onPress={() => onChangeTool("text")}
            className="px-4"
          >
            <Icon icon="lucide:type" />
          </Button>
        </Tooltip>
        
        <Tooltip content="図形ツール (S)" placement="bottom">
          <Dropdown>
            <DropdownTrigger>
              <Button 
                isIconOnly
                color={activeTool === "shape" ? "primary" : "default"}
                className="px-4"
              >
                <Icon icon="lucide:square" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="図形ツール"
              onAction={(_key) => onChangeTool("shape")}
            >
              <DropdownItem
                key="rectangle"
                startContent={<Icon icon="lucide:square" />}
              >
                長方形
              </DropdownItem>
              <DropdownItem
                key="circle"
                startContent={<Icon icon="lucide:circle" />}
              >
                円
              </DropdownItem>
              <DropdownItem
                key="triangle"
                startContent={<Icon icon="lucide:triangle" />}
              >
                三角形
              </DropdownItem>
              <DropdownItem
                key="line"
                startContent={<Icon icon="lucide:minus" />}
              >
                直線
              </DropdownItem>
              <DropdownItem
                key="arrow"
                startContent={<Icon icon="lucide:arrow-right" />}
              >
                矢印
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Tooltip>
        
        <Tooltip content="画像ツール (I)" placement="bottom">
          <Button 
            isIconOnly
            color={activeTool === "image" ? "primary" : "default"}
            onPress={() => onChangeTool("image")}
            className="px-4"
          >
            <Icon icon="lucide:image" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};