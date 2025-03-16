"use client";

import { useState } from "react";
import { ProjectUploadType } from "@/types/project";
import ProjectUploadService from "@/services/clientServices/projectUpload/ProjectUploadService";
import { toast } from "@/hooks/use-toast";

export const useProjectUpload = () => {
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(false);
  const createNew = async (data: ProjectUploadType) => {
    setPublishing(true);
    setLoading(true);
    try {
      const response = await ProjectUploadService.createProject(data);

      return response;
    } catch (error) {
      toast({
        title: "Success",
        description: "Project created successfully",
        variant: "default",
      });

      throw error;
    } finally {
      setPublishing(false);
      setLoading(false);
    }
  };

  const updateExisting = async (data: ProjectUploadType) => {
    setPublishing(true);
    setLoading(true);
    try {
      const response = await ProjectUploadService.updateProject(data);

      return response;
    } catch (error) {
      toast({
        title: "Success",
        description: "Project updated successfully",
        variant: "default",
      });
      throw error;
    } finally {
      setPublishing(false);
      setLoading(false);
    }
  };

  const deleteExisting = async (projectId: string) => {
    setPublishing(true);
    setLoading(true);
    try {
      const response = await ProjectUploadService.deleteProject(projectId);

      return response;
    } catch (error) {
      toast({
        title: "Error Deleting Project",
        description: error.message || "Unknown Reason.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
      setPublishing(false);
    }
  };

  return {
    publishing,
    createNew,
    loading,
    updateExisting,
    deleteExisting,
  };
};
