// useProjectUpload.js
"use client";
import { useState } from "react";
import { ProjectUploadType } from "@/types/project";
import { createNewProject, updateProject } from "@/services/Projects/projectUploadService";
import { ProjectOperationResponse } from "@/types/others";

export const useProjectUpload = () => {
  const [publishing, setPublishing] = useState(false);

  const handleProjectOperation = async (
    operation: (data: ProjectUploadType) => Promise<ProjectOperationResponse | null>,
    data: ProjectUploadType,
    errorMessage: string
  ) => {
    setPublishing(true);
    try {
      const response = await operation(data);
      if (!response?.success) throw new Error(errorMessage);
      return response;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setPublishing(false);
    }
  };

  return {
    publishing,
    createNew: (data: ProjectUploadType) => handleProjectOperation(createNewProject, data, "Failed to create project."),
    updateExisting: (data: ProjectUploadType) => handleProjectOperation(updateProject, data, "Failed to update project."),
  };
};