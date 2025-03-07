import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";

interface GetChatHistoryProps {
  userId: string;
  page?: number;
  limit?: number;
}

class ChatService {
  private static apiService = ApiService.getInstance();

  static getChatHistory = async ({
    userId,
    page = 1,
    limit = 100,
  }: GetChatHistoryProps): Promise<ApiResponse> => {
    try {
      console.log("Fetching chat history for userId:", userId);

      // Construct URL with query parameters manually
      const url = `/connect/chat?recipient=${userId}&page=${page}&limit=${limit}`;

      const response = await this.apiService.get<ApiResponse>(url);

      if (!response.data.success || response.status !== 200) {
        return {
          success: false,
          message: response.data.message || "Failed to fetch chat history",
        };
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
      return { success: false, message: error.message };
    }
  };
}

export default ChatService;
