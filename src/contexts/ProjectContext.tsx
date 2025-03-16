import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { ICopyright, ProjectStatus, License } from "@/types/project";
import { Itool } from "@/types/others";
import { MiniUser } from "@/types/user";
import { ProjectMetadata, UIState } from "@/types/contexts";

/**
 * Interface for project data excluding media/thumbnail.
 */
export interface ProjectContextType {
  tags: string[];
  updateTags: (tags: string[]) => void;
  // Project metadata without the thumbnail field.
  projectMetadata: Omit<ProjectMetadata, "thumbnail">;
  updateProjectMetadata: (
    data: Partial<Omit<ProjectMetadata, "thumbnail">>,
  ) => void;
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
  tools: Itool[];
  updateTools: (tools: Itool[]) => void;
  copyRight: ICopyright;
  updateCopyRight: (copyRight: Partial<ICopyright>) => void;
  editorStage: 0 | 1 | 2;
  updateEditorStage: (stage: 0 | 1 | 2) => void;
  collaborators: MiniUser[];
  updateCollaborators: (collaborators: MiniUser[]) => void;
}

interface ProjectProviderProps {
  children: ReactNode;
  // initialData may contain extra fields; thumbnail is ignored.
  initialData?: Partial<Omit<ProjectMetadata, "thumbnail">> & {
    tags?: string[];
    tools?: Itool[];
    collaborators?: MiniUser[];
    copyRight?: ICopyright;
    editorStage?: 0 | 1 | 2;
    uiState?: UIState;
  };
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
  initialData = {},
}) => {
  // Initialize project metadata without thumbnail.
  const [projectMetadata, setProjectMetadata] = useState<
    Omit<ProjectMetadata, "thumbnail">
  >({
    title: initialData?.title || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    category: initialData?.category || "",
    status: initialData?.status || ProjectStatus?.DRAFT,
    featured: initialData?.featured || false,
    projectUrl: initialData?.projectUrl || "",
    stats: initialData?.stats || { views: 0, likes: 0, comments: 0 },
  });

  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tools, setTools] = useState<Itool[]>(initialData?.tools || []);
  const [collaborators, setCollaborators] = useState<MiniUser[]>(
    initialData?.collaborators || [],
  );
  const [copyRight, setCopyRight] = useState<ICopyright>(
    initialData?.copyRight || {
      allowsDownload: false,
      commercialUse: false,
      license: License.All_Rights_Reserved,
    },
  );
  const [editorStage, setEditorStage] = useState<0 | 1 | 2>(
    initialData?.editorStage || 0,
  );
  const [uiState, setUIState] = useState<UIState>(
    initialData?.uiState || {
      isImageLoading: false,
      isDescOpen: !!(initialData?.description || initialData?.shortDescription),
      isUploading: false,
      showProjectDesc: false,
    },
  );

  // Memoize update functions
  const updateProjectMetadata = useCallback(
    (data: Partial<Omit<ProjectMetadata, "thumbnail">>) => {
      setProjectMetadata((prev) => ({ ...prev, ...data }));
    },
    [],
  );

  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTags = useCallback((newTags: string[]) => {
    setTags(newTags);
  }, []);

  const updateTools = useCallback((newTools: Itool[]) => {
    setTools(newTools);
  }, []);

  const updateCopyRight = useCallback((data: Partial<ICopyright>) => {
    setCopyRight((prev) => ({ ...prev, ...data }));
  }, []);

  const updateEditorStage = useCallback((stage: 0 | 1 | 2) => {
    setEditorStage(stage);
  }, []);

  const updateCollaborators = useCallback((newCollaborators: MiniUser[]) => {
    setCollaborators(newCollaborators);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      tags,
      updateTags,
      projectMetadata,
      updateProjectMetadata,
      uiState,
      updateUIState,
      tools,
      updateTools,
      copyRight,
      updateCopyRight,
      editorStage,
      updateEditorStage,
      collaborators,
      updateCollaborators,
    }),
    [
      tags,
      projectMetadata,
      uiState,
      tools,
      copyRight,
      editorStage,
      collaborators,
      updateTags,
      updateProjectMetadata,
      updateUIState,
      updateTools,
      updateCopyRight,
      updateEditorStage,
      updateCollaborators,
    ],
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
