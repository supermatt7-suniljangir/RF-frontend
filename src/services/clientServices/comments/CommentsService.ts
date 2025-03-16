import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { IComment } from "@/types/others";

interface DeleteCommentProps {
  projectId: string;
  commentId: string;
}

interface PostCommentProps {
  projectId: string;
  content: string;
}

interface FetchCommentsProps {
  projectId: string;
}

class CommentsService {
  private static apiService = ApiService.getInstance();

  static deleteComment = async ({
    projectId,
    commentId,
  }: DeleteCommentProps): Promise<ApiResponse> => {
    const response = await this.apiService.delete<ApiResponse>(
      `/comments/${projectId}/${commentId}`,
    );
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  static postComment = async ({
    projectId,
    content,
  }: PostCommentProps): Promise<ApiResponse<IComment>> => {
    const response = await this.apiService.post<ApiResponse<IComment>>(
      `/comments/${projectId}`,
      { content },
    );
    if (!response.data.success || response.status !== 201) {
      throw new Error(response.data.message);
    }
    return response.data;
  };

  // ✅ New: Fetch Comments
  static getComments = async ({
    projectId,
  }: FetchCommentsProps): Promise<ApiResponse<IComment[]>> => {
    const response = await this.apiService.get<ApiResponse<IComment[]>>(
      `/comments/${projectId}`,
    );
    if (response.status !== 200 || !response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data;
  };
}

export default CommentsService;
