import React, { createContext, useContext, ReactNode } from "react";
import { useProjectContext } from "./ProjectContext";
import { useUser } from "@/contexts/UserContext";
import { useProjectUploadHandler } from "@/features/project/usePrepareProjectUpload";
import {
  ProjectStatus,
  Imedia,
  TempMedia,
  ProjectUploadType,
  Thumbnail,
} from "@/types/project";
import { useMediaUpload } from "./MediaContext";

interface UploadProjectContextType {
  uploadProject: (status: ProjectStatus) => Promise<void>;
}

const UploadProjectContext = createContext<
  UploadProjectContextType | undefined
>(undefined);

interface UploadProjectProviderProps {
  children: ReactNode;
  projectID: string;
}

export const UploadProjectProvider: React.FC<UploadProjectProviderProps> = ({
  children,
  projectID,
}) => {
  const { projectMetadata, tags, tools, collaborators, copyRight } =
    useProjectContext();
  const { initialMedia, newMedia, initialThumbnail, newThumbnail } =
    useMediaUpload();
  const { user } = useUser();
  const { handleProjectUpload } = useProjectUploadHandler(projectID);

  // Compute final thumbnail using newThumbnail if available; otherwise fallback to initialThumbnail
  const finalThumbnail: Thumbnail = newThumbnail
    ? newThumbnail
    : { url: initialThumbnail, file: undefined, type: "image/thumbnail" };

  /**
   * Prepare and upload project data
   */
  const uploadProject = async (status: ProjectStatus) => {
    // Prepare project data from both contexts
    const projectData: ProjectUploadType = {
      ...(projectID && { _id: projectID }),
      title: projectMetadata.title,
      description: projectMetadata.description,
      shortDescription: projectMetadata.shortDescription,
      thumbnail: finalThumbnail,
      // Combine initial and new media
      media: [...initialMedia, ...newMedia],
      creator: user._id,
      collaborators: collaborators.map((collab) => collab._id),
      tags: tags,
      tools: tools.map((tool) => tool._id) as any,
      category: projectMetadata.category,
      stats: projectMetadata.stats,
      featured: projectMetadata.featured || false,
      status: status || projectMetadata.status,
      projectUrl: projectMetadata.projectUrl || "",
      copyright: copyRight,
      publishedAt: Date.now(),
    };

    // Call the updated hook which now handles everything internally
    await handleProjectUpload(projectData);
  };

  return (
    <UploadProjectContext.Provider value={{ uploadProject }}>
      {children}
    </UploadProjectContext.Provider>
  );
};

export const useUploadProject = (): UploadProjectContextType => {
  const context = useContext(UploadProjectContext);
  if (!context) {
    throw new Error(
      "useUploadProject must be used within an UploadProjectProvider",
    );
  }
  return context;
};
