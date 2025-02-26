"use client";

import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/lib/ApiResponse";
import { UploadFileResponse } from "@/types/upload";

class FilesUploadService {
  private static api = ApiService.getInstance();
  private static uploadEndpoint = "/upload/files";
  static getUploadUrls = async (
    files: File[]
  ): Promise<UploadFileResponse[]> => {
    const metadata = files.map((file) => ({
      filename: file.name,
      contentType: file.type,
    }));

    const response = await this.api.post<ApiResponse<UploadFileResponse[]>>(
      this.uploadEndpoint,
      {
        files: metadata,
      }
    );
    if (!response.data.success || response.status !== 200) {
      console.error("Failed to get upload URLs", response);
      throw new Error("Failed to get upload URLs.");
    }
    return response.data.data;
  };

  static uploadFiles = async (
    uploadData: { uploadUrl: string; file: File }[]
  ) => {
    const results = await Promise.allSettled(
      uploadData.map(({ uploadUrl, file }) =>
        fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        })
      )
    );
    const failedUploads = results.filter((res) => res.status === "rejected");

    if (failedUploads.length) {
      console.error("Failed to upload files", failedUploads);
      throw new Error(`${failedUploads.length} file(s) failed to upload.`);
    }

    return results;
  };
}

export default FilesUploadService;
