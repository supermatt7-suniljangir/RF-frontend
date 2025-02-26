import { Itool } from "./others";
import {
  ICopyright,
  Imedia,
  IStats,
  ProjectStatus,
  TempMedia,
  Thumbnail,
} from "./project";
import { MiniUser } from "./user";

export type ProjectMetadata = {
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: Thumbnail;
  category: string;
  status: ProjectStatus;
  projectUrl?: string;
  featured?: boolean;
  stats?: IStats;
};

export type UIState = {
  isImageLoading: boolean;
  isDescOpen: boolean;
  isUploading: boolean;
  showProjectDesc: boolean;
};

export interface ProjectEditorContextType {
  mediaContainerRef?: React.RefObject<HTMLDivElement>;
  media: Imedia[];
  tags: string[];
  updateTags: (tags: string[]) => void;
  projectMetadata: ProjectMetadata;
  uiState: UIState;
  tools: Itool[];
  copyRight: ICopyright;
  editorStage: 0 | 1 | 2;
  collaborators: MiniUser[];
  updateCollaborators: (collaborators: MiniUser[]) => void;
  updateEditorStage: (stage: 0 | 1 | 2) => void;
  updateTools: (tools: Itool[]) => void;
  updateCopyRight: (copyRight: Partial<ICopyright>) => void;
  updateUIState: (updates: Partial<UIState>) => void;
  removeMedia: (mediaItem: Imedia) => void;
  updateMedia: (media: Imedia[]) => void;
  updateProjectMetadata: (data: Partial<ProjectMetadata>) => void;
  uploadProject: (status: ProjectStatus) => Promise<void>;
}

export interface MediaContextType {
  
  existingMedia: Imedia[];
  newMedia: TempMedia[];
  thumbnail: Thumbnail | null;
  setExistingMedia: (media: Imedia[]) => void;
  setNewMedia: (media: TempMedia[]) => void;
  setThumbnail: (thumbnail: Thumbnail | null) => void;
  removeMedia: (url: string) => void;
  addNewMedia: (media: TempMedia[]) => void;
  resetNewMedia: () => void;
  mediaContainerRef: React.RefObject<HTMLDivElement>;
}
