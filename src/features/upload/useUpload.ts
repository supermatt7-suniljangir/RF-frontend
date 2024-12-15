import { useState } from "react";
import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { UploadFileResponse } from "@/types/upload";



export function useUploadFiles() {
  const [loading, setLoading] = useState<boolean>(false);
  const getUploadUrl = async (metadata: {
    [key: string]: string;
  }): Promise<UploadFileResponse | null> => {
    try {
      setLoading(true);
      const apiService = ApiService.getInstance();
      const url = "/upload/file";
      const response: ApiResponse<UploadFileResponse> = await apiService.post(
        url,
        metadata
      );
      if (!response?.data?.key || !response.data.uploadUrl) {
        console.error("Failed to get upload URL");
        throw new Error("Failed to get upload URL");
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching upload URL:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    uploadUrl: string,
    file: File
  ) => {
    try {
      setLoading(true);

      const fileUploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
   
      if (!fileUploadResponse.ok) {
        console.error("File upload failed");
        return null;
      }

      return fileUploadResponse;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getUploadUrl, uploadFile, loading };
}
