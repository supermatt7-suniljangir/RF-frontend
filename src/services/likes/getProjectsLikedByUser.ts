"use server";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";
import { MiniProject } from "@/types/project";
import { cookies } from "next/headers";

export const getProjectsLikedByUser = async ({
  userId,
}: {
  userId?: string;
}): Promise<MiniProject[]> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const url = `${URL}/likes/${userId ? userId : "personal"}/user`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      next: {
        tags: [`likedProjects`],
        revalidate: 60 * 60,
      },
    });

    const result: ApiResponse = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch liked projects");
    }

    return result.data;
  } catch (error: any) {
    console.error("Error fetching liked projects:", error.message);
    return [];
  }
};
