import React from "react";
import { Button, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { Icon } from "@iconify/react";
import { SaveProjectModal } from "./save-project-modal";
import { LoadProjectModal } from "./load-project-modal";
import { Canvas } from "./canvas";
import { Sidebar } from "./sidebar";
import { Dashboard } from "./dashboard";

export const AppContent: React.FC = () => {
  const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"saved" | "saving" | "unsaved">("saved");
  const [showDashboard, setShowDashboard] = React.useState(true);

  // Simulate auto-save functionality
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
      }, 1000);
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar maxWidth="full" className="border-b border-divider">
        <NavbarBrand>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setShowDashboard(!showDashboard)}
            className="mr-2"
          >
            <Icon icon={showDashboard ? "lucide:layout-dashboard" : "lucide:home"} className="text-primary text-xl" />
          </Button>
          <p className="font-semibold text-inherit">Canvas Image Gen</p>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          <div className="flex items-center gap-2">
            {!showDashboard && (
              <>
                {saveStatus === "saved" && (
                  <span className="text-tiny text-success flex items-center gap-1">
                    <Icon icon="lucide:check-circle" className="text-sm" />
                    保存済み
                  </span>
                )}
                {saveStatus === "saving" && (
                  <span className="text-tiny text-warning flex items-center gap-1">
                    <Icon icon="lucide:loader" className="text-sm animate-spin" />
                    保存中...
                  </span>
                )}
                {saveStatus === "unsaved" && (
                  <span className="text-tiny text-danger flex items-center gap-1">
                    <Icon icon="lucide:alert-circle" className="text-sm" />
                    未保存
                  </span>
                )}
                
                <Button 
                  color="primary"
                  variant="flat"
                  endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                  onPress={() => setIsSaveModalOpen(true)}
                >
                  保存
                </Button>
                
                <Button 
                  variant="flat"
                  onPress={() => setIsLoadModalOpen(true)}
                >
                  開く
                </Button>
              </>
            )}
          </div>
        </NavbarContent>
      </Navbar>

      {showDashboard ? (
        <Dashboard />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-4">
            <Canvas />
          </div>
          <div className="w-80 border-l border-divider p-4 bg-content1">
            <Sidebar />
          </div>
        </div>
      )}

      <SaveProjectModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        onSaved={() => {
          setSaveStatus("saved");
          setIsSaveModalOpen(false);
        }}
      />

      <LoadProjectModal 
        isOpen={isLoadModalOpen} 
        onClose={() => setIsLoadModalOpen(false)}
      />
    </div>
  );
};