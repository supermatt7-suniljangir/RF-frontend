"use client";

import { useState } from "react";
import { ProjectUploadType } from "@/types/project";
import { projectUploadService } from "@/services/Projects/projectUploadService";
import { toast } from "@/hooks/use-toast";

export const useProjectUpload = () => {
  const [publishing, setPublishing] = useState(false);

  const createNew = async (data: ProjectUploadType) => {
    setPublishing(true);
    try {
      const response = await projectUploadService.createProject(data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setPublishing(false);
    }
  };

  const updateExisting = async (data: ProjectUploadType) => {
    setPublishing(true);
    try {
      const response = await projectUploadService.updateProject(data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setPublishing(false);
    }
  };

  return {
    publishing,
    createNew,
    updateExisting,
  };
};
