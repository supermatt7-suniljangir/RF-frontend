"use client";
import React, { ReactNode } from "react";
import { ProjectType } from "@/types/project";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MediaUploadProvider } from "@/contexts/MediaContext";
import { UploadProjectProvider } from "@/contexts/UploadProjectContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

interface ProjectEditorProviderProps {
  children: ReactNode;
  initialData?: Partial<ProjectType> | null;
}

const ProjectEditorProvider: React.FC<ProjectEditorProviderProps> = ({
  children,
  initialData,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) {
    return (
      <div>
        <p className="text-center text-muted-foreground">
          This page is not supported on mobile devices. Please use a desktop
          device.
        </p>
      </div>
    );
  }
  return (
    <ProjectProvider initialData={initialData}>
      <MediaUploadProvider
        initialMediaData={initialData?.media || []}
        initialThumbnailData={initialData?.thumbnail || ""}
      >
        <UploadProjectProvider projectID={initialData?._id}>
          {children}
        </UploadProjectProvider>
      </MediaUploadProvider>
    </ProjectProvider>
  );
};

export default ProjectEditorProvider;
