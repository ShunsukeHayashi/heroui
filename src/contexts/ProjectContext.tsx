import React from "react";
import { openDB, IDBPDatabase } from "idb";
import { Project } from "../types/project";
import { CanvasElement } from "../types/canvas-element";
import { TLRecord } from "@tldraw/tldraw";
import { GenerationContext } from "../types/generation-context";
import { GenerationResult } from "../types/generation-result";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  selectedElements: CanvasElement[];
  setSelectedElements: (elements: CanvasElement[]) => void;
  loadProject: (id: string) => Promise<void>;
  saveProject: (project: Omit<Project, "id">) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createNewProject: () => void;
  updateElement: (updatedElement: CanvasElement) => void;
  deleteElement?: (id: string) => void;
  saveCanvasState: (projectId: string, state: Record<string, TLRecord>) => Promise<void>;
  loadCanvasState: (projectId: string) => Promise<Record<string, TLRecord> | null>;
  generationContext: GenerationContext;
  setGenerationContext: (context: GenerationContext) => void;
  generationResults: GenerationResult[];
  addGenerationResult: (result: GenerationResult) => void;
  addToCanvas: (result: GenerationResult) => void;
}

const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

// Sample projects data for demonstration
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Forest Landscape",
    description: "A serene forest landscape with mountains in the background",
    lastModified: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    canvasSnapshot: "snapshot-data-1",
    thumbnailUrl: "https://img.heroui.chat/image/landscape?w=400&h=300&u=1"
  },
  {
    id: "2",
    name: "Character Design",
    description: "Fantasy character concept art",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    canvasSnapshot: "snapshot-data-2",
    thumbnailUrl: "https://img.heroui.chat/image/ai?w=400&h=300&u=2"
  },
  {
    id: "3",
    name: "Product Mockup",
    description: "Mobile app interface design",
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    canvasSnapshot: "snapshot-data-3",
    thumbnailUrl: "https://img.heroui.chat/image/dashboard?w=400&h=300&u=3"
  }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = React.useState<IDBPDatabase | null>(null);
  const [projects, setProjects] = React.useState<Project[]>(sampleProjects);
  const [currentProject, setCurrentProject] = React.useState<Project | null>(null);
  const [selectedElements, setSelectedElements] = React.useState<CanvasElement[]>([]);
  
  // Add generation context state
  const [generationContext, setGenerationContext] = React.useState<GenerationContext>({
    text: [],
    images: [],
    shapes: [],
    combinedText: "",
    selectionType: "none",
  });
  
  // Add generation results state
  const [generationResults, setGenerationResults] = React.useState<GenerationResult[]>([]);
  
  // Initialize IndexedDB
  React.useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB("canvas-image-gen", 1, {
          upgrade(db) {
            // Create object stores
            if (!db.objectStoreNames.contains("projects")) {
              const projectStore = db.createObjectStore("projects", { keyPath: "id" });
              projectStore.createIndex("lastModified", "lastModified");
            }
          }
        });
        
        setDb(database);
        
        // Load projects from IndexedDB
        const storedProjects = await database.getAll("projects");
        if (storedProjects.length > 0) {
          setProjects(storedProjects);
        } else {
          // If no projects in DB, use sample data and store it
          for (const project of sampleProjects) {
            await database.put("projects", project);
          }
        }
      } catch (error) {
        console.error("Failed to initialize IndexedDB:", error);
      }
    };
    
    initDB();
  }, []);
  
  const loadProject = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id) || null;
      if (project) {
        setCurrentProject(project);
        
        // Update last modified date
        const updatedProject = {
          ...project,
          lastModified: new Date()
        };
        
        // Update in state and IndexedDB
        setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
        if (db) {
          await db.put("projects", updatedProject);
        }
      }
    } catch (error) {
      console.error("Failed to load project:", error);
    }
  };
  
  const saveProject = async (projectData: Omit<Project, "id">) => {
    try {
      // If editing existing project
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          ...projectData,
          lastModified: new Date()
        };
        
        // Update in state and IndexedDB
        setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
        setCurrentProject(updatedProject);
        
        if (db) {
          await db.put("projects", updatedProject);
        }
        
        return;
      }
      
      // If creating new project
      const newProject: Project = {
        id: `project-${Date.now()}`,
        ...projectData,
        lastModified: new Date()
      };
      
      // Update state and IndexedDB
      setProjects(prev => [...prev, newProject]);
      setCurrentProject(newProject);
      
      if (db) {
        await db.put("projects", newProject);
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      throw error;
    }
  };
  
  const deleteProject = async (id: string) => {
    try {
      // Remove from state
      setProjects(prev => prev.filter(p => p.id !== id));
      
      // If current project is deleted, clear it
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
      
      // Remove from IndexedDB
      if (db) {
        await db.delete("projects", id);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };
  
  const createNewProject = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: "Untitled Project",
      description: "",
      lastModified: new Date(),
      canvasSnapshot: ""
    };
    
    setCurrentProject(newProject);
  };
  
  const updateElement = (updatedElement: CanvasElement) => {
    // Update the element in the selectedElements array
    setSelectedElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
    // In a real implementation, we would update the element in the canvas data structure
    console.log("Element updated:", updatedElement);
  };
  
  const deleteElement = (id: string) => {
    // Remove from selected elements
    setSelectedElements(prev => prev.filter(el => el.id !== id));
    // In a real implementation, we would remove the element from the canvas data structure
    console.log("Element deleted:", id);
  };
  
  // Save tldraw canvas state
  const saveCanvasState = async (projectId: string, state: Record<string, TLRecord>) => {
    try {
      if (!db) return;
      
      // Find the project
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      
      // Update project with new canvas state
      const updatedProject = {
        ...project,
        canvasState: state,
        lastModified: new Date()
      };
      
      // Update in state and IndexedDB
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
      if (currentProject?.id === projectId) {
        setCurrentProject(updatedProject);
      }
      
      await db.put("projects", updatedProject);
      console.log("Canvas state saved for project:", projectId);
    } catch (error) {
      console.error("Failed to save canvas state:", error);
    }
  };
  
  // Load tldraw canvas state
  const loadCanvasState = async (projectId: string): Promise<Record<string, TLRecord> | null> => {
    try {
      // Find the project
      const project = projects.find(p => p.id === projectId);
      if (!project) return null;
      
      // Return canvas state if it exists
      return project.canvasState || null;
    } catch (error) {
      console.error("Failed to load canvas state:", error);
      return null;
    }
  };
  
  // Add a new generation result
  const addGenerationResult = (result: GenerationResult) => {
    setGenerationResults(prev => [result, ...prev]);
  };
  
  // Add a generation result to the canvas
  const addToCanvas = (result: GenerationResult) => {
    // In a real implementation, we would add the result to the tldraw canvas
    // This would involve creating a new shape with the image or video
    console.log("Adding to canvas:", result);
    
    // For demo purposes, we'll just log it
    // In a real implementation with tldraw, we would do something like:
    // editor.createShape({
    //   type: result.type === "image" ? "image" : "video",
    //   props: {
    //     url: result.url,
    //     w: result.width,
    //     h: result.height,
    //   },
    // });
  };
  
  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      selectedElements,
      setSelectedElements,
      loadProject,
      saveProject,
      deleteProject,
      createNewProject,
      updateElement,
      deleteElement,
      saveCanvasState,
      loadCanvasState,
      generationContext,
      setGenerationContext,
      generationResults,
      addGenerationResult,
      addToCanvas,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};