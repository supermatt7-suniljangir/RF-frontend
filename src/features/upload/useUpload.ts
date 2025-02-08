import { useState } from "react";
import ApiService, { ApiResponse } from "@/api/wrapper/axios-wrapper";
import { UploadFileResponse } from "@/types/upload";

export function useUploadFiles() {
  const [loading, setLoading] = useState(false);

  const getUploadUrls = async (
    files: File[]
  ): Promise<UploadFileResponse[] | null> => {
    try {
      setLoading(true);
      const apiService = ApiService.getInstance();
      const url = "/upload/files"; 
      const metadata = files.map((file) => ({
        filename: file.name,
        contentType: file.type,
      }));
      const response: ApiResponse<UploadFileResponse[]> = await apiService.post(
        url,
        { files: metadata }
      );
      if (!response?.data?.length)
        throw new Error("Failed to get upload URLs.");
      return response.data;
    } catch (error) {
      console.error("Error fetching upload URLs:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (
    uploadData: { uploadUrl: string; file: File }[]
  ) => {
    try {
      setLoading(true);

      const results = await Promise.all(
        uploadData.map(({ uploadUrl, file }) =>
          fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          })
        )
      );

      const failedUploads = results.filter((res) => !res.ok);
      if (failedUploads.length) throw new Error("Some uploads failed.");
      return results;
    } catch (error) {
      console.error("Error uploading files:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getUploadUrls, uploadFiles, loading };
}
