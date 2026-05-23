"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Imedia, Ithumbnail, TempMedia, Thumbnail } from "@/types/project";
import { Config } from "@/config/config";
import FilesUploadService from "@/services/clientServices/filesUpload/FilesUploadService";
import { CloudinaryUploadResponse, GeneratedUploadURL } from "@/types/upload";

const validateFiles = (files: TempMedia[] | Thumbnail[]) => {
  const { MAX_IMAGE_SIZE, MAX_FILES } = Config.FILE_LIMITS;

  if (files.filter((f) => !f.type.includes("image")).length > 0) {
    throw new Error("Only images are allowed.");
  }

  if (files.length > MAX_FILES) {
    throw new Error(`Upload between 1 and ${MAX_FILES} files.`);
  }

  for (const file of files) {
    if (file.type.includes("image") && file.file.size > MAX_IMAGE_SIZE) {
      throw new Error(
        `uploaded images must be less than ${(MAX_IMAGE_SIZE / (1024 * 1024)).toFixed(1)}MB.`,
      );
    }
  }
};

const compressImages = async <T extends TempMedia | Thumbnail>(
  files: T[],
): Promise<T[]> => {
  const options = Config.COMPRESSION_OPTIONS;

  const compressedFiles = await Promise.all(
    files.map(async (file) => {
      try {
        if (file.file.type === "image/gif") {
          return file;
        }

        const sizeMB = file.file.size / (1024 * 1024);

        if (sizeMB < 5) {
          return file;
        }

        const compressionOptions = {
          ...options.default,
          useWebWorker: true,
          maxWidthOrHeight: 1920,
        };

        if (sizeMB < 8) {
          compressionOptions.maxSizeMB = sizeMB * 0.8;
        } else {
          compressionOptions.maxSizeMB = sizeMB * 0.7;
        }

        const compressedFile = await imageCompression(
          file.file,
          compressionOptions,
        );

        return {
          ...file,
          file: compressedFile,
        };
      } catch (error) {
        console.error("Image compression failed:", error);
        return file;
      }
    }),
  );

  return compressedFiles;
};

const uploadProjectFiles = async (
  files: TempMedia[],
  thumbnail?: Thumbnail,
) => {
  try {
    if (files.length === 0 && !thumbnail) {
      throw new Error("No files to upload");
    }

    // =========================
    // MEDIA
    // =========================

    let uploadedMedia: Imedia[] = [];

    if (files.length > 0) {
      validateFiles(files);

      const processedFiles = await compressImages(files);

      const mediaUploadUrls: GeneratedUploadURL[] =
        await FilesUploadService.getUploadUrls(processedFiles);

      const mediaUploadData = processedFiles.map((file) => {
        const uploadData = mediaUploadUrls.find((item) => item.id === file.id);

        if (!uploadData) {
          throw new Error(`Upload URL not found for file ${file.id}`);
        }

        return {
          key: uploadData.key,
          uploadUrl: uploadData.uploadUrl,
          file: file.file,
        };
      });

      const uploadedMediaResponse: CloudinaryUploadResponse[] =
        await FilesUploadService.uploadFiles(mediaUploadData);

      uploadedMedia = uploadedMediaResponse.map((item) => ({
        type: item.resource_type as "image",
        key: item.public_id,
        url: item.secure_url,
      }));
    }

    // =========================
    // THUMBNAIL
    // =========================

    let uploadedThumbnail = null;

    if (thumbnail) {
      validateFiles([thumbnail]);

      const [processedThumbnail] = await compressImages([thumbnail]);

      const [thumbnailUploadUrl] = await FilesUploadService.getUploadUrls([
        processedThumbnail,
      ]);

      const thumbnailUploadData = [
        {
          key: thumbnailUploadUrl.key,
          uploadUrl: thumbnailUploadUrl.uploadUrl,
          file: processedThumbnail.file,
        },
      ];

      const [thumbnailResponse] =
        await FilesUploadService.uploadFiles(thumbnailUploadData);

      uploadedThumbnail = {
        type: "image/thumbnail",
        key: thumbnailResponse.public_id,
        url: thumbnailResponse.secure_url,
      };
    }

    return {
      media: uploadedMedia,
      thumbnail: uploadedThumbnail,
    };
  } catch (error) {
    console.error("Project files upload failed", error);
    throw error;
  }
};

export const useProjectFilesUploader = () => {
  const [loading, setLoading] = useState(false);

  const handleProjectFilesUpload = async (
    files: TempMedia[],
    thumnail?: Thumbnail | Ithumbnail,
  ) => {
    setLoading(true);

    try {
      return await uploadProjectFiles(files, thumnail as Thumbnail);
    } finally {
      setLoading(false);
    }
  };

  return { handleProjectFilesUpload, loading };
};
