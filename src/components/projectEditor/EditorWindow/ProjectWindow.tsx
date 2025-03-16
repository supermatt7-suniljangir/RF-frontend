"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProjectThumbnail from "./ProjectThumbnail";
import ProjectWindowSidebar from "./ProjectWindowSidebar";
import Spinner from "@/app/loading";
import { ProjectStatus } from "@/types/project";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useUploadProject } from "@/contexts/UploadProjectContext";

const ProjectWindow: React.FC = () => {
  // Use the new standardized context hooks
  const {
    editorStage,
    updateEditorStage,
    uiState: { isUploading },
  } = useProjectContext();
  const { uploadProject } = useUploadProject();
  const onClose = () => updateEditorStage(1);
  const isOpen = editorStage === 2;

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-[90vh] rounded-none p-4">
          <div className="flex flex-col gap-4 h-full relative overflow-auto">
            <DialogTitle className="sr-only">Project Editor</DialogTitle>

            <Card className="h-full w-full flex lg:flex-row flex-col rounded-none overflow-auto">
              <ProjectThumbnail />
              <ProjectWindowSidebar />
            </Card>

            <DialogFooter className="flex justify-end gap-4 bg-background p-4">
              <Button
                variant="ghost"
                className="rounded-none w-24"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                disabled={isUploading}
                onClick={() => uploadProject(ProjectStatus.DRAFT)}
                className="bg-muted text-muted-foreground rounded-none w-24"
              >
                {isUploading ? <Spinner /> : "Save Draft"}
              </Button>
              <Button
                variant="secondary"
                className="rounded-none w-24"
                onClick={() => uploadProject(ProjectStatus.PUBLISHED)}
                disabled={isUploading}
              >
                {isUploading ? "Publishing" : "Publish"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectWindow;
