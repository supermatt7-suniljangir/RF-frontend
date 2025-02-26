import { Itool } from "@/types/others";
import { URL } from "@/api/config/configs";
import ApiService from "@/api/wrapper/axios-wrapper";

class ToolService {
  private static apiService = ApiService.getInstance();

  // Fetch all tools
  static getTools = async (cacheSettings?: RequestCache) => {
    try {
      const url = `${URL}/tools`;
      const response = await fetch(url, {
        method: "GET",
        cache: cacheSettings || "force-cache",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw new Error("Failed to fetch tools");
    }
  };

  // Create a new tool
  static createTool = async (name: string, icon: string) => {
    try {
      const payload = { name, icon };
      const response = await this.apiService.post("/api/tools", payload);
      if (response.error || response.status !== 201 || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new Error("Failed to create tool");
    }
  };

  // Delete a tool
  static deleteTool = async (toolId: string) => {
    try {
      const response = await this.apiService.delete(`/api/tools/${toolId}`);
      if (response.error || response.status !== 200 || !response.data) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete tool");
    }
  };
}

export default ToolService;
