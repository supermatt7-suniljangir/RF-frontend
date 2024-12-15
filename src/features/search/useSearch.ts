// import { useQuery } from "@tanstack/react-query";
// import { fetchProjects, fetchUsers } from "@/services/search/search";
// import { SearchParams } from "@/types/common";

// export const useSearch = (params: SearchParams) => {
//   const { type } = params;
//   const {
//     data: usersSearchResults,
//     isLoading: isUsersLoading,
//     error: usersError,
//   } = useQuery({
//     queryKey: ["searchUsers", params],
//     queryFn: () => fetchUsers(params),
//     staleTime: 1000 * 60 * 5,
//     enabled: type === "user",
//   });

//   const {
//     data: projectsSearchResults,
//     isLoading: isProjectsLoading,
//     error: projectsError,
//   } = useQuery({
//     queryKey: ["searchProjects", params],
//     queryFn: () => fetchProjects(params),
//     staleTime: 1000 * 60 * 5,
//     enabled: type !== "user",
//   });

//   return {
//     isUsersLoading,
//     usersError,
//     usersSearchResults,
//     isProjectsLoading,
//     projectsError,
//     projectsSearchResults,
//   };
// };

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
