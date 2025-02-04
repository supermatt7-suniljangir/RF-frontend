// this will contain all the data for creating or updating a project
"use client";
import { useState } from "react";
import { ProjectUploadType } from "@/types/project";
import {
  createNewProject,
  updateProject,
} from "@/services/Projects/uploadUpdate";
import { ProjectOperationResponse } from "@/types/others";

export const useProject = () => {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createNew = async (data: ProjectUploadType) => {
    setPublishing(true);
    setError(null);
    try {
      const response: ProjectOperationResponse | null = await createNewProject(
        data
      );
      if (!response.success) {
        setError("Failed to create project.");
      }
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
    } finally {
      setPublishing(false);
    }
  };

  const updateExisting = async (data: ProjectUploadType) => {
    setPublishing(true);
    setError(null);
    try {
      const response: ProjectOperationResponse | null = await updateProject(
        data
      );
      if (!response.success) {
        setError("Failed to update project.");
      }
      return response;
    } catch (err) {
      setError(err.message || "Failed to fetch projects.");
    } finally {
      setPublishing(false);
    }
  };

  return {
    publishing,
    error,
    createNew,
    updateExisting,
  };
};
