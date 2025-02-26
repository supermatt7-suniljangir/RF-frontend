"use server";

import { cookies } from "next/headers";
import { MiniProject } from "@/types/project";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";

export const getProfileProjectsAPI = async (
  userId?: string
): Promise<ApiResponse> => {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;
    const urlPath = userId
      ? `projects/${userId}/user`
      : "projects/personal/user";
    const url = `${URL}/${urlPath}`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 60 * 15,
        tags: [`userProjects-${userId ? userId : "personal"}`],
      },
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Cookie: `auth_token=${authToken}` } : {}),
      },
    });

    const data: ApiResponse<MiniProject[]> = await response.json();

    if (!response.ok || !data.success) {
      console.error("Failed to fetch user projects:", data.message);
      return {
        success: false,
        message: data.message || "Failed to fetch user projects",
        data: [],
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return {
      success: false,
      message: (error as Error).message || "Error fetching user projects",
      data: [],
    };
  }
};
