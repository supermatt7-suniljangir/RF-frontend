"use client";
import { useState, useEffect } from "react";
import { Itool } from "@/types/others";
import ToolService from "@/services/clientServices/tools/ToolsService";

interface ToolError {
  message: string;
  status?: number;
}

const useTools = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ToolError | null>(null);
  const [tools, setTools] = useState<Itool[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  const getTools = async (cacheSettings?: RequestCache) => {
    setIsLoading(true);
    setError(null);

    try {
      const toolsData = await ToolService.getTools(cacheSettings);
      setTools(toolsData);
    } catch (error) {
      let errorMessage = "Failed to fetch tools";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const createTool = async (name: string, icon: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ToolService.createTool(name, icon);
      setSuccess(true);
      // Optionally, refresh tools after creating a new one
      await getTools();
      return response;
    } catch (error) {
      let errorMessage = "Failed to create tool";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTool = async (toolId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ToolService.deleteTool(toolId);
      setSuccess(true);
      // Optionally, refresh tools after deleting one
      await getTools();
      return response;
    } catch (error) {
      let errorMessage = "Failed to delete tool";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tools as soon as the hook is initialized
  useEffect(() => {
    getTools();
  }, []);

  return {
    isLoading,
    error,
    success,
    tools,
    createTool,
    getTools,
    deleteTool,
  };
};

export default useTools;
