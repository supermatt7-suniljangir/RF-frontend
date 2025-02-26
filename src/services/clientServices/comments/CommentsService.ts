import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";

interface DeleteCommentProps {
  projectId: string;
  commentId: string;
}

interface Comment {
  projectId: string;
  content: string;
}

class CommentsService {
  private static apiService = ApiService.getInstance();

  static deleteComment = async ({
    projectId,
    commentId,
  }: DeleteCommentProps): Promise<ApiResponse> => {
    const response = await this.apiService.delete<ApiResponse>(
      `/comments/${projectId}/${commentId}`
    );
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  static postComment = async ({
    projectId,
    content,
  }: Comment): Promise<ApiResponse> => {
    const response = await this.apiService.post<ApiResponse>(
      `/comments/${projectId}`,
      { content }
    );
    if (!response.data.success || response.status !== 201) {
      throw new Error(response.data.message);
    }
    return response.data;
  };
}

export default CommentsService;
