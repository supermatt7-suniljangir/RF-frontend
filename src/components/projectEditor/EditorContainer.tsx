"use client";
import React, { useRef } from "react";
import BuildComponents from "./BuildComponents";
import ProjectMedia from "./ProjectMedia";
import ProjectMetadata from "./ProjectMetadata";
import Spinner from "@/app/loading";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useMediaUpload } from "@/contexts/MediaContext";

const EditorContainer = () => {
  const {
    uiState: { isDescOpen, isUploading },
  } = useProjectContext();

  const { initialMedia, newMedia } = useMediaUpload();
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  // Combine initial and new media for rendering
  const media = [...initialMedia, ...newMedia];

  if (isUploading) return <Spinner />;

  return (
    <div className="w-full flex">
      <div className="w-1/5 sticky top-0 left-0 h-screen">
        <BuildComponents />
      </div>
      <div className="w-4/5 flex flex-col p-4">
        <div ref={mediaContainerRef} className="flex flex-col">
          {!isDescOpen && !media.length && (
            <div className="text-muted-foreground font-medium text-center pt-20">
              Add Media to get started
            </div>
          )}
          <ProjectMedia />
          <ProjectMetadata />
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;
