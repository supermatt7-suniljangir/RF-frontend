import SearchService from "@/services/search/search";
import {
  SearchParams,
  UserSearchResponse,
  ProjectSearchResponse,
} from "@/types/common";
import { useState } from "react";

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchUsers = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const data: UserSearchResponse = await SearchService.fetchUsers(params);
      return data;
    } catch (err) {
      setError(err.message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchProjects = async (params: SearchParams) => {
    setIsLoading(true);
    try {
      const data: ProjectSearchResponse = await SearchService.fetchProjects(params);
      return data;
    } catch (err) {
      setError(err.message);
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    searchUsers,
    searchProjects,
  };
};
