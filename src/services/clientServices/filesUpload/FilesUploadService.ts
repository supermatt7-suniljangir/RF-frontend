"use client";

import ApiService from "@/api/wrapper/axios-wrapper";
import { ApiResponse } from "@/types/ApiResponse";
import { TempMedia, Thumbnail } from "@/types/project";
import { CloudinaryUploadResponse, GeneratedUploadURL } from "@/types/upload";

class FilesUploadService {
  private static api = ApiService.getInstance();
  private static uploadEndpoint = "/upload/files";
  static getUploadUrls = async (
    files: TempMedia[] | Thumbnail[],
  ): Promise<GeneratedUploadURL[]> => {
    const metadata = files.map((item) => ({
      filename: item.file.name,
      contentType: item.file.type,
      id: item?.id || null,
    }));

    const response = await this.api.post<ApiResponse<GeneratedUploadURL[]>>(
      this.uploadEndpoint,
      {
        files: metadata,
      },
    );
    if (!response.data.success || response.status !== 200) {
      console.error("Failed to get upload URLs", response);
      throw new Error("Failed to get upload URLs.");
    }
    return response.data.data;
  };

  static uploadFiles = async (
    uploadData: { uploadUrl: string; file: File }[],
  ): Promise<CloudinaryUploadResponse[]> => {
    try {
      // Process each upload individually to handle errors better
      const results = await Promise.all(
        uploadData.map(async ({ uploadUrl, file }) => {
          try {
            const response = await fetch(uploadUrl, {
              method: "PUT",
              body: file,
              headers: { "Content-Type": file.type },
            });

            const data = await response.json();

            // S3 returns 200 for successful uploads
            if (!response.ok) {
              throw new Error(
                `Upload failed with status: ${response.status} ${response.statusText}`,
              );
            }
            return data;
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            throw error; // Re-throw to be caught by the outer Promise.all
          }
        }),
      );
      return results;
    } catch (error) {
      console.error("Failed to upload one or more files:", error);
      throw new Error("File upload failed. Please try again.");
    }
  };
}

export default FilesUploadService;
