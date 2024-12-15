// import { API } from "@/api/config/axios";
// import {
//   ProjectSearchResponse,
//   SearchParams,
//   UserSearchResponse,
// } from "@/types/common";

// //  function to clearn params and only keep the valid string values
// export const cleanParams = (params: SearchParams) => {
//   const cleanedParams: SearchParams = { page: params.page };
//   Object.keys(params).forEach((key) => {
//     if (typeof params[key] === "string" && params[key].trim() !== "") {
//       cleanedParams[key] = params[key];
//     }
//   });
//   return cleanedParams;
// };

// // Fetch users function
// export const fetchUsers = async (params: SearchParams) => {
//   const cleanedParams = cleanParams(params);
//   const response = await API.get<UserSearchResponse>("/search/users", {
//     params: cleanedParams,
//   });
//   if (response.status !== 200 || !response?.data) {
//     throw new Error("Failed to fetch users.");
//   }
//   return response.data;
// };

// // Fetch projects function
// export const fetchProjects = async (params: SearchParams) => {
//   const cleanedParams = cleanParams(params);
//   console.log('cleanedParams:', cleanedParams);

//   const response = await API.get<ProjectSearchResponse>("/search/projects", {
//     params: cleanedParams,
//   });
//   if (response.status !== 200 || !response?.data) {
//     throw new Error("Failed to fetch projects.");
//   }
//   return response.data;
// };



import { ProjectSearchResponse, SearchParams, UserSearchResponse } from "@/types/common";

// Function to clean params and only keep valid string values
export const cleanParams = (params: SearchParams) => {
  const cleanedParams: SearchParams = { page: params.page };
  Object.keys(params).forEach((key) => {
    if (typeof params[key] === "string" && params[key].trim() !== "") {
      cleanedParams[key] = params[key];
    }
  });
  return cleanedParams;
};

// Helper function to build query strings from params
const buildQueryString = (params: SearchParams) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
};

// Fetch users function
export const fetchUsers = async (params: SearchParams): Promise<UserSearchResponse> => {
  const cleanedParams = cleanParams(params);
  const queryString = buildQueryString(cleanedParams);
 const url = `${process.env.NEXT_PUBLIC_API_URL}/search/users?${queryString}`

  const response = await fetch(url, {
    method: "GET",
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }

  const data: UserSearchResponse = await response.json();
  return data;
};

// Fetch projects function
export const fetchProjects = async (params: SearchParams): Promise<ProjectSearchResponse> => {
  const cleanedParams = cleanParams(params);
  console.log("cleanedParams:", cleanedParams);

  const queryString = buildQueryString(cleanedParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/search/projects?${queryString}`

  const response = await fetch(url, {
    method: "GET",
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects.");
  }

  const data: ProjectSearchResponse = await response.json();
  return data;
};
