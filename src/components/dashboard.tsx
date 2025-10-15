import React from "react";
import { 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader,
  Button, 
  Tabs, 
  Tab, 
  Chip,
  Progress,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useProjectContext } from "../contexts/ProjectContext";
import { RecentProjectsList } from "./recent-projects-list";
import { GenerationStats } from "./generation-stats";
import { UsageTips } from "./usage-tips";

export const Dashboard: React.FC = () => {
  const { projects, createNewProject, loadProject } = useProjectContext();
  const [selectedTab, setSelectedTab] = React.useState("projects");
  
  // Calculate user phase based on projects and generation history
  const userPhase = React.useMemo(() => {
    if (projects.length === 0) return "onboarding";
    if (projects.length < 3) return "exploration";
    if (projects.length < 8) return "retention";
    return "power-user";
  }, [projects]);
  
  // Get phase-specific content
  const getPhaseContent = () => {
    switch (userPhase) {
      case "onboarding":
        return {
          title: "Canvas Image Genへようこそ！",
          description: "直感的なキャンバス操作と高品質な画像・動画生成を体験しましょう。",
          icon: "lucide:sparkles",
          color: "primary"
        };
      case "exploration":
        return {
          title: "さらに可能性を探索しましょう",
          description: "テキスト→画像、画像→動画など様々な生成モードをお試しください。",
          icon: "lucide:compass",
          color: "secondary"
        };
      case "retention":
        return {
          title: "ワークフローに組み込みましょう",
          description: "プロジェクト管理と履歴機能で作業を効率化できます。",
          icon: "lucide:repeat",
          color: "success"
        };
      case "power-user":
        return {
          title: "パワーユーザーになりました！",
          description: "高度な機能を活用して、さらに創作を加速させましょう。",
          icon: "lucide:zap",
          color: "warning"
        };
      default:
        return {
          title: "Canvas Image Gen",
          description: "AIを活用したクリエイティブツール",
          icon: "lucide:palette",
          color: "primary"
        };
    }
  };
  
  const phaseContent = getPhaseContent();
  
  // Calculate completion percentage for current phase
  const getPhaseCompletion = () => {
    switch (userPhase) {
      case "onboarding": 
        return projects.length > 0 ? 100 : 0;
      case "exploration":
        return Math.min(100, (projects.length / 3) * 100);
      case "retention":
        return Math.min(100, (projects.length / 8) * 100);
      case "power-user":
        return 100;
      default:
        return 0;
    }
  };
  
  return (
    <div className="w-full h-full overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <Card className="w-full">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${phaseContent.color}/10`}>
                <Icon icon={phaseContent.icon} className={`text-${phaseContent.color} text-3xl`} />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">{phaseContent.title}</h1>
                <p className="text-default-600">{phaseContent.description}</p>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-default-600">現在のフェーズ: {
                      userPhase === "onboarding" ? "オンボーディング" :
                      userPhase === "exploration" ? "探索フェーズ" :
                      userPhase === "retention" ? "定着フェーズ" :
                      "パワーユーザー"
                    }</span>
                    <span className="text-default-500">{Math.round(getPhaseCompletion())}%</span>
                  </div>
                  <Progress 
                    value={getPhaseCompletion()} 
                    color={phaseContent.color as "primary" | "secondary" | "success" | "warning"} 
                    className="h-2"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  color="primary"
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={createNewProject}
                >
                  新規プロジェクト
                </Button>
                <Button
                  variant="flat"
                  startContent={<Icon icon="lucide:folder-open" />}
                  onPress={() => loadProject(projects[0]?.id)}
                  isDisabled={projects.length === 0}
                >
                  最近のプロジェクト
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects */}
          <div className="lg:col-span-2">
            <Card className="w-full h-full">
              <CardHeader className="px-6 py-4">
                <Tabs 
                  selectedKey={selectedTab} 
                  onSelectionChange={(key) => setSelectedTab(key as string)}
                  aria-label="Dashboard tabs"
                >
                  <Tab key="projects" title="プロジェクト" />
                  <Tab key="history" title="生成履歴" />
                  <Tab key="templates" title="テンプレート" />
                </Tabs>
              </CardHeader>
              <Divider />
              <CardBody className="p-6 overflow-auto">
                {selectedTab === "projects" && (
                  <RecentProjectsList />
                )}
                {selectedTab === "history" && (
                  <div className="text-center py-12 text-default-500">
                    <Icon icon="lucide:history" className="text-4xl mb-2 mx-auto" />
                    <p>生成履歴はプロジェクト内で確認できます</p>
                  </div>
                )}
                {selectedTab === "templates" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["商品撮影", "風景画", "キャラクターデザイン", "広告バナー"].map((template) => (
                      <Card key={template} isPressable className="border border-default-200">
                        <CardBody className="p-4">
                          <h3 className="font-medium">{template}</h3>
                          <p className="text-tiny text-default-500">テンプレートを使って素早く開始</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
              <Divider />
              <CardFooter className="px-6 py-4">
                <div className="w-full flex justify-between items-center">
                  <span className="text-default-500 text-sm">
                    {projects.length} プロジェクト
                  </span>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:plus" />}
                    onPress={createNewProject}
                  >
                    新規作成
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column - Stats & Tips */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card className="w-full">
              <CardHeader className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">利用統計</h2>
                  <Chip size="sm" variant="flat" color="primary">今月</Chip>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
                <GenerationStats />
              </CardBody>
            </Card>
            
            {/* Tips based on user phase */}
            <Card className="w-full">
              <CardHeader className="px-6 py-4">
                <h2 className="text-lg font-medium">次のステップ</h2>
              </CardHeader>
              <Divider />
              <CardBody className="p-6">
                <UsageTips userPhase={userPhase} />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};