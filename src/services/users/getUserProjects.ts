import { cookies } from "next/headers";
import { MiniProject } from "@/types/project";
import { URL } from "@/api/config/configs";
import { ApiResponse } from "@/lib/ApiResponse";

export const getUserProjectsApi = async (
  userId?: string
): Promise<MiniProject[]> => {
  const cookieStore = await cookies(); // Access the cookies
  const authToken = cookieStore.get("auth_token")?.value;
  const urlPath = userId ? `projects/${userId}/user` : "projects/personal/user";
  try {
    const url = `${URL}/${urlPath}`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 60 * 15,
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${authToken}`,
      },
    });

    const data: ApiResponse = await response.json();
    if (!data.success || !response.ok) {
      console.error(
        "Failed to fetch user projects, API returned success false",
        data
      );
      throw new Error(data.message || "Failed to fetch user projects");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};
