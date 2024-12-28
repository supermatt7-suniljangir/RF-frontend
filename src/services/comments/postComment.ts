"use server";
import { URL } from "@/api/config/configs";
import { IComment } from "@/types/others";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { toast } from "@/hooks/use-toast";

interface Comment {
  projectId: string;
  content: string;
}

interface PostCommentResponse {
  success: boolean;
  message: string;
  data: IComment; // Assuming you return a single comment object after creation
}

export async function postCommentApi({ projectId, content }: Comment) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  if (!cookieHeader) {
    console.error("Auth token is missing");
    return null;
  }

  try {
    const response = await fetch(`${URL}/comments/${projectId}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Failed to post comment",
        description: response.statusText,
      });
      return null;
    }

    const data: PostCommentResponse = await response.json();
    revalidatePath(`/project/${projectId}`);

    return data;
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
  }
}
