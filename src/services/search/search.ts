import {
  ProjectSearchResponse,
  SearchParams,
  UserSearchResponse,
} from "@/types/common";

// Function to clean params and only keep valid string values
export const cleanParams = (params: SearchParams) => {
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
};

// Helper function to build query strings from params
const buildQueryString = (params: SearchParams) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");
};

// Fetch users function
export const fetchUsers = async (
  params: SearchParams,
  cacheSettings?: RequestCache,
  signal?: AbortSignal
): Promise<UserSearchResponse> => {
  const cleanedParams = cleanParams(params);
  const queryString = buildQueryString(cleanedParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/search/users?${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    next: {
      revalidate: 5 * 60,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }

  const data: UserSearchResponse = await response.json();
  return data;
};

// Fetch projects function
export const fetchProjects = async (
  params: SearchParams
): Promise<ProjectSearchResponse> => {
  const cleanedParams = cleanParams(params);
  const queryString = buildQueryString(cleanedParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/search/projects?${queryString}`;

  const response = await fetch(url, {
    next: {
      revalidate: 5 * 60,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects.");
  }

  const data: ProjectSearchResponse = await response.json();
  return data;
};
