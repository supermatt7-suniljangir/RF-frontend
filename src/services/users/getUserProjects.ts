import { cookies } from "next/headers";
import { MiniProject } from "@/types/project";
import { URL } from "@/api/config/configs";

interface ProjectsResponse {
  success: boolean;
  count: number;
  data: MiniProject[];
}

export const getUserProjectsApi = async (
  userId?: string
): Promise<MiniProject[] | null> => {
  const cookieStore = await cookies(); // Access the cookies
  const authToken = cookieStore.get("auth_token")?.value;
  const urlPath = userId ? `projects/user/${userId}` : `projects/user/personal`;
  try {
    const url = `${URL}/${urlPath}`;

    const response = await fetch(url, {
      method: "GET",
      next: {
        revalidate: 60 * 15,
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${authToken || ""}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user projects:", response.statusText);
      return null;
    }

    const data: ProjectsResponse = await response.json();

    if (!data.success) {
      console.error(
        "Failed to fetch user projects, API returned success false",
        data
      );
      return null;
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return null;
  }
};
