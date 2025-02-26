"use client";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";
import { ProjectSearchResponse, UserSearchResponse } from "@/types/common";

class SearchService {
  // Fetch users function
  static async fetchUsers(
    queryString: string,
    signal?: AbortSignal
  ): Promise<UserSearchResponse> {
    const url = `${URL}/search/users?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 5 * 60,
      },
      cache: "default",
      signal,
    });

    const data: ApiResponse = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(`Failed to fetch users. ${data.message}`);
    }
    return data.data;
  }

  // Fetch projects function
  static async fetchProjects(
    queryString: string
  ): Promise<ProjectSearchResponse> {
    const url = `${URL}/search/projects?${queryString}`;

    const response = await fetch(url, {
      next: {
        revalidate: 5 * 60,
      },
      method: "GET",
    });

    const data: ApiResponse = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(`Failed to fetch projects. ${data.message}`);
    }
    return data.data;
  }
}

export default SearchService;
