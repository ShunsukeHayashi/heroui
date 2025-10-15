import { ProjectProvider } from "./contexts/ProjectContext";
import { AppContent } from "./components/app-content";

export default function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}