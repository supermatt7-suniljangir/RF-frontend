import { useState } from "react";
import { fetchProjects, fetchUsers } from "@/services/search/search";
import {
  SearchParams,
  UserSearchResponse,
  ProjectSearchResponse,
} from "@/types/common";

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: UserSearchResponse = await fetchUsers(params);
      if (!data.data || !data) return null;
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchProjects = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: ProjectSearchResponse = await fetchProjects(params);
      if (!data || !data.data) return null;
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch projects.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    searchUsers,
    searchProjects,
  };
};
