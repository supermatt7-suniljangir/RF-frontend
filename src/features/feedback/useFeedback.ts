import { useState } from "react";
import ApiService from "../../api/wrapper/axios-wrapper";
import { URLResolver } from "../../backend/URLResolver";

interface FeedbackError {
  message: string;
  status?: number;
}
interface CreateFeedbackPayload {
  page_url: string;
  description: string;
}

const useFeedback = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FeedbackError | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const apiService = ApiService.getInstance();

  const feedback = async (data: CreateFeedbackPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: CreateFeedbackPayload = {
        page_url: data.page_url,
        description: data.description,
      };
      const response = await apiService.post(URLResolver.feedback(), payload);
      if (response.error || response.status !== 201 || !response.data) {
        throw new Error(response.error);
      }
      setSuccess(true);
      return response;
    } catch (error) {
      let errorMessage = "Failed to submit feedback";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError({
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    feedback,
  };
};

export default useFeedback;
