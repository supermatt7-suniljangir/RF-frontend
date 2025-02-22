"use client";
import { ApiResponse } from "@/lib/ApiResponse";
import {
  ProjectSearchResponse,
  SearchParams,
  UserSearchResponse,
} from "@/types/common";

class SearchService {
  // Function to clean params and only keep valid string values
  static cleanParams(params: SearchParams) {
    const cleanedParams: SearchParams = { page: params.page };
    Object.keys(params).forEach((key) => {
      if (
        (typeof params[key] === "string" && params[key].trim() !== "") ||
        (typeof params[key] === "number" && params[key] !== undefined)
      ) {
        cleanedParams[key] = params[key];
      }
    });
    return cleanedParams;
  }

  // Helper function to build query strings from params
  static buildQueryString(params: SearchParams) {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
  }

  // Fetch users function
  static async fetchUsers(
    params: SearchParams,
    cacheSettings?: RequestCache,
    signal?: AbortSignal
  ): Promise<UserSearchResponse> {
    const cleanedParams = this.cleanParams(params);
    const queryString = this.buildQueryString(cleanedParams);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/search/users?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 5 * 60,
      },
      cache: cacheSettings || "default",
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
    params: SearchParams
  ): Promise<ProjectSearchResponse> {
    const cleanedParams = this.cleanParams(params);
    const queryString = this.buildQueryString(cleanedParams);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/search/projects?${queryString}`;

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
