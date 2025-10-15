import React from "react";
import { Button, Tabs, Tab, Textarea, Select, SelectItem, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";

export const Sidebar: React.FC = () => {
  const { currentProject, generationContext } = useProjectContext();
  const [activeTab, setActiveTab] = React.useState("generate");
  const [prompt, setPrompt] = React.useState("");
  const [generationMode, setGenerationMode] = React.useState("t2i");
  
  // Update prompt when selection changes
  React.useEffect(() => {
    if (generationContext.combinedText) {
      setPrompt(generationContext.combinedText);
    }
  }, [generationContext]);
  
  const handleGenerate = () => {
    console.log("Generating with mode:", generationMode, "and prompt:", prompt);
    // In a real implementation, this would open the generation modal
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-medium">{currentProject?.name || "プロジェクト"}</h2>
        <p className="text-xs text-default-500">
          {currentProject?.lastModified ? 
            `最終更新: ${new Date(currentProject.lastModified).toLocaleString('ja-JP')}` : 
            "未保存"
          }
        </p>
      </div>
      
      <Divider className="my-2" />
      
      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={(key) => setActiveTab(key as string)}
        aria-label="サイドバータブ"
        className="flex-1 flex flex-col"
      >
        <Tab key="generate" title={
          <div className="flex items-center gap-1">
            <Icon icon="lucide:wand-sparkles" />
            <span>生成</span>
          </div>
        }>
          <div className="space-y-4 py-2 flex-1 flex flex-col">
            <div className="space-y-2">
              <label className="text-sm font-medium">生成モード</label>
              <Select
                selectedKeys={[generationMode]}
                onChange={(e) => setGenerationMode(e.target.value)}
                size="sm"
              >
                <SelectItem key="t2i">テキスト→画像</SelectItem>
                <SelectItem key="i2i">画像→画像</SelectItem>
                <SelectItem key="t2v">テキスト→動画</SelectItem>
                <SelectItem key="i2v">画像→動画</SelectItem>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">プロンプト</label>
                {generationContext.selectionType !== "none" && (
                  <span className="text-xs text-primary">
                    選択要素を使用中
                  </span>
                )}
              </div>
              
              <Textarea 
                className="flex-1 min-h-[120px]"
                placeholder="生成したい内容を詳細に記述..."
                value={prompt}
                onValueChange={setPrompt}
              />
            </div>
            
            <Button 
              color="primary" 
              className="w-full"
              startContent={<Icon icon="lucide:wand-sparkles" />}
              onPress={handleGenerate}
              isDisabled={!prompt.trim()}
            >
              生成
            </Button>
          </div>
        </Tab>
        
        <Tab key="history" title={
          <div className="flex items-center gap-1">
            <Icon icon="lucide:history" />
            <span>履歴</span>
          </div>
        }>
          <div className="py-2 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Select
                size="sm"
                className="w-32"
                selectedKeys={["all"]}
              >
                <SelectItem key="all">すべて</SelectItem>
                <SelectItem key="t2i">テキスト→画像</SelectItem>
                <SelectItem key="i2i">画像→画像</SelectItem>
                <SelectItem key="t2v">テキスト→動画</SelectItem>
                <SelectItem key="i2v">画像→動画</SelectItem>
              </Select>

              <Select
                size="sm"
                className="w-32"
                selectedKeys={["newest"]}
              >
                <SelectItem key="newest">新しい順</SelectItem>
                <SelectItem key="oldest">古い順</SelectItem>
                <SelectItem key="cost-high">コスト高い順</SelectItem>
                <SelectItem key="cost-low">コスト低い順</SelectItem>
              </Select>
            </div>
            
            <div className="flex-1 overflow-auto">
              <div className="text-center py-12 text-default-500">
                <Icon icon="lucide:history" className="text-4xl mb-2 mx-auto" />
                <p>生成履歴がありません</p>
              </div>
            </div>
          </div>
        </Tab>
        
        <Tab key="settings" title={
          <div className="flex items-center gap-1">
            <Icon icon="lucide:settings" />
            <span>設定</span>
          </div>
        }>
          <div className="py-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">API設定</h3>
                <div className="space-y-2">
                  <Select
                    label="デフォルトモデル"
                    size="sm"
                    selectedKeys={["sdxl"]}
                  >
                    <SelectItem key="sdxl">Stable Diffusion XL</SelectItem>
                    <SelectItem key="dalle3">DALL-E 3</SelectItem>
                    <SelectItem key="midjourney">Midjourney</SelectItem>
                  </Select>
                  
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Icon icon="lucide:key" />}
                    className="w-full"
                  >
                    APIキーを設定
                  </Button>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-sm font-medium mb-2">表示設定</h3>
                <div className="space-y-2">
                  <Select
                    label="テーマ"
                    size="sm"
                    selectedKeys={["system"]}
                  >
                    <SelectItem key="system">システム設定に合わせる</SelectItem>
                    <SelectItem key="light">ライトモード</SelectItem>
                    <SelectItem key="dark">ダークモード</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};