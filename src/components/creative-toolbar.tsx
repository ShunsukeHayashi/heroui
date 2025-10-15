import React from "react";
import { Button, ButtonGroup, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { GenerationModal } from "./generation-modal";
import { ImageEditModal } from "./image-edit-modal";

export const CreativeToolbar: React.FC = () => {
  const { generationContext } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [initialTab, setInitialTab] = React.useState<"image" | "video">("image");
  const [generationType, setGenerationType] = React.useState<"selection" | "text">("selection");
  
  // Determine if selection-based generation is available
  const hasSelection = generationContext.selectionType !== "none";
  
  const handleOpenModal = (tab: "image" | "video", type: "selection" | "text") => {
    setInitialTab(tab);
    setGenerationType(type);
    setIsModalOpen(true);
  };
  
  const [isImageEditModalOpen, setIsImageEditModalOpen] = React.useState(false);
  
  return (
    <>
      <Card className="shadow-md">
        <CardBody className="py-2 px-2">
          <div className="flex flex-col gap-2">
            <div className="bg-content1 rounded-xl p-2 shadow-md">
              <p className="text-xs font-medium text-default-600 mb-2 px-1">選択から生成</p>
              <ButtonGroup variant="flat" className="gap-1">
                <Tooltip content={hasSelection ? "選択から画像を生成" : "要素を選択してください"}>
                  <Button
                    color="primary"
                    startContent={<Icon icon="lucide:image" />}
                    className="px-3"
                    onPress={() => handleOpenModal("image", "selection")}
                    isDisabled={!hasSelection}
                  >
                    選択→画像
                  </Button>
                </Tooltip>
                <Tooltip content={hasSelection ? "選択から動画を生成" : "要素を選択してください"}>
                  <Button
                    color="secondary"
                    startContent={<Icon icon="lucide:video" />}
                    className="px-3"
                    onPress={() => handleOpenModal("video", "selection")}
                    isDisabled={!hasSelection}
                  >
                    選択→動画
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </div>
            
            <div className="bg-content1 rounded-xl p-2 shadow-md">
              <p className="text-xs font-medium text-default-600 mb-2 px-1">テキストから生成</p>
              <ButtonGroup variant="flat" className="gap-1">
                <Tooltip content="テキストから画像を生成">
                  <Button
                    color="primary"
                    variant="ghost"
                    startContent={<Icon icon="lucide:text" />}
                    endContent={<Icon icon="lucide:arrow-right" className="text-xs" />}
                    className="px-3"
                    onPress={() => handleOpenModal("image", "text")}
                  >
                    テキスト→画像
                  </Button>
                </Tooltip>
                <Tooltip content="テキストから動画を生成">
                  <Button
                    color="secondary"
                    variant="ghost"
                    startContent={<Icon icon="lucide:text" />}
                    endContent={<Icon icon="lucide:arrow-right" className="text-xs" />}
                    className="px-3"
                    onPress={() => handleOpenModal("video", "text")}
                  >
                    テキスト→動画
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </div>
            
            <div className="bg-content1 rounded-xl p-2 shadow-md">
              <p className="text-xs font-medium text-default-600 mb-2 px-1">クイック生成</p>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="default"
                    variant="bordered"
                    startContent={<Icon icon="lucide:sparkles" />}
                    endContent={<Icon icon="lucide:chevron-down" className="text-xs" />}
                    className="w-full"
                  >
                    クイックプリセット
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="クイックプリセット">
                  <DropdownItem
                    key="landscape"
                    startContent={<Icon icon="lucide:mountain" />}
                    description="自然風景を生成"
                    onPress={() => handleOpenModal("image", "text")}
                  >
                    風景画像
                  </DropdownItem>
                  <DropdownItem
                    key="character"
                    startContent={<Icon icon="lucide:user" />}
                    description="キャラクターを生成"
                    onPress={() => handleOpenModal("image", "text")}
                  >
                    キャラクター
                  </DropdownItem>
                  <DropdownItem
                    key="animation"
                    startContent={<Icon icon="lucide:video" />}
                    description="アニメーションを生成"
                    onPress={() => handleOpenModal("video", "text")}
                  >
                    アニメーション
                  </DropdownItem>
                  <DropdownItem
                    key="product"
                    startContent={<Icon icon="lucide:shopping-bag" />}
                    description="商品イメージを生成"
                    onPress={() => handleOpenModal("image", "text")}
                  >
                    商品イメージ
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            
            {/* Add Image Edit button */}
            <Tooltip content="画像編集" placement="right">
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsImageEditModalOpen(true)}
              >
                <Icon icon="lucide:edit-3" className="text-lg" />
              </Button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>
      
      <GenerationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={initialTab}
        generationType={generationType}
      />
      
      {/* Add Image Edit Modal */}
      <ImageEditModal
        isOpen={isImageEditModalOpen}
        onClose={() => setIsImageEditModalOpen(false)}
      />
    </>
  );
};