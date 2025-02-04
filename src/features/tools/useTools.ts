"use client";
import { useState, useEffect } from "react";
import ApiService from "../../api/wrapper/axios-wrapper";
import { Itool } from "@/types/others";
import { URL } from "@/api/config/configs";

interface ToolError {
  message: string;
  status?: number;
}

interface IGetToolResponse {
  data: Itool[];
  success: boolean;
}

const useTools = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ToolError | null>(null);
  const [tools, setTools] = useState<Itool[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const apiService = ApiService.getInstance();

  const getTools = async (cacheSettings?: RequestCache) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = `${URL}/tools`;
      const response = await fetch(url, {
        method: "GET",
        cache: cacheSettings || "force-cache",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data: IGetToolResponse = await response.json();
      setTools(data.data);
    } catch (error) {
      let errorMessage = "Failed to fetch tools";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTool = async (name: string, icon: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = { name, icon };
      const response = await apiService.post("/api/tools", payload);
      if (response.error || response.status !== 201 || !response.data) {
        throw new Error(response.error);
      }
      setSuccess(true);
      // Optionally, refresh tools after creating a new one
      await getTools();
      return response;
    } catch (error) {
      let errorMessage = "Failed to create tool";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTool = async (toolId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.delete(`/api/tools/${toolId}`);
      if (response.error || response.status !== 200 || !response.data) {
        throw new Error(response.error);
      }
      setSuccess(true);
      // Optionally, refresh tools after deleting one
      await getTools();
      return response;
    } catch (error) {
      let errorMessage = "Failed to delete tool";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({
        message: errorMessage,
      });
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
