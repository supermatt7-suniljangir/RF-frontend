"use client";

import { useState } from "react";
import { ProjectUploadType } from "@/types/project";
import ProjectUploadService from "@/services/clientServices/projectUpload/ProjectUploadService";
import { toast } from "@/hooks/use-toast";

export const useProjectUpload = () => {
  const [publishing, setPublishing] = useState(false);

  const createNew = async (data: ProjectUploadType) => {
    setPublishing(true);
    try {
      const response = await ProjectUploadService.createProject(data);
      if (response.success) {
        toast({
          title: "Success",
          description: "Project created successfully",
          variant: "default",
        });
      }
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
      const response = await ProjectUploadService.updateProject(data);
      if (response.success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
          variant: "default",
        });
      }
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
