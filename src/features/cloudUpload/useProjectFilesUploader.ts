"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Imedia, Ithumbnail, TempMedia, Thumbnail } from "@/types/project";
import { Config } from "@/config/config";
import FilesUploadService from "@/services/clientServices/filesUpload/FilesUploadService";
import { CloudinaryUploadResponse, GeneratedUploadURL } from "@/types/upload";

const validateFiles = (files: TempMedia[]) => {
  const { MAX_IMAGE_SIZE, MAX_FILES } = Config.FILE_LIMITS;

  //  check if any file is anything other than image or video
  if (files.filter((f) => !f.type.includes("image")).length > 0) {
    throw new Error("Only images are allowed.");
  }

  if (files.length > MAX_FILES) {
    throw new Error(`Upload between 1 and ${MAX_FILES} files.`);
  }

  for (const file of files) {
    if (file.type.includes("image") && file.file.size > MAX_IMAGE_SIZE) {
      throw new Error("Images must be < 5MB.");
    }
  }
};

const compressImages = async (files: TempMedia[]): Promise<TempMedia[]> => {
  const compressedFiles: TempMedia[] = [];
  const options = Config.COMPRESSION_OPTIONS;

  for (const file of files) {
    try {
      const sizeMB = file.file.size / (1024 * 1024);

      if (sizeMB < 1) {
        // ("Skipping compression for small file");
        compressedFiles.push(file);
        continue;
      }

      const compressionOptions = { ...options.default };
      if (sizeMB < 2) {
        compressionOptions.maxSizeMB = 1;
      } else if (sizeMB < 4) {
        compressionOptions.maxSizeMB = 2.5;
      } else {
        compressionOptions.maxSizeMB = 3;
      }

      const compressedFile = await imageCompression(
        file.file,
        compressionOptions,
      );
      compressedFiles.push({ ...file, file: compressedFile });
    } catch (error) {
      console.error(`Image compression failed:`, error);
      compressedFiles.push(file);
    }
  }

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

    if (files.length > 0) {
      validateFiles(files);
    }

    const processedFiles = files.length > 0 ? await compressImages(files) : [];

    const processedFilesMap = new Map(
      processedFiles.map((file) => [file.id, file.file]),
    );

    // =========================
    // MEDIA
    // =========================

    const mediaUploadUrls: GeneratedUploadURL[] =
      processedFiles.length > 0
        ? await FilesUploadService.getUploadUrls(processedFiles)
        : [];

    const mediaUploadData = mediaUploadUrls.map((item) => ({
      key: item.key,
      uploadUrl: item.uploadUrl,
      file: processedFilesMap.get(item.id),
    }));

    const uploadedMediaResponse: CloudinaryUploadResponse[] =
      mediaUploadData.length > 0
        ? await FilesUploadService.uploadFiles(mediaUploadData)
        : [];

    const uploadedMedia: Imedia[] = uploadedMediaResponse.map((item) => ({
      type: item.resource_type as "image",
      key: item.public_id,
      url: item.secure_url,
    }));
    // =========================
    // THUMBNAIL
    // =========================

    let uploadedThumbnail = null;

    if (thumbnail) {
      const [thumbnailUploadUrl] = await FilesUploadService.getUploadUrls([
        thumbnail,
      ]);

      const thumbnailUploadData = [
        {
          key: thumbnailUploadUrl.key,
          uploadUrl: thumbnailUploadUrl.uploadUrl,
          file: thumbnail.file,
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
      thumbnail: uploadedThumbnail ?? null,
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
      return await uploadProjectFiles(files, thumnail);
    } finally {
      setLoading(false);
    }
  };

  return { handleProjectFilesUpload, loading };
};
