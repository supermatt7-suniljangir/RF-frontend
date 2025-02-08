
// useCloudUploader.js
"use client";
import { useState } from "react";
import { useUploadFiles } from "@/features/upload/useUpload";
import { toast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import { getFileUrl } from "@/lib/getFileUrl";
import { Imedia, TempMedia } from "@/types/project";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const validateFiles = (files: TempMedia[]) => {
  if (files.length === 0 || files.length > 10) {
    toast({ title: "Invalid File Count", description: "Please upload between 1 and 10 images.", variant: "destructive" });
    return false;
  }
  if (files.filter((f) => f.type.includes("video")).length > 1) {
    toast({ title: "Too Many Videos", description: "You can only upload 1 video.", variant: "destructive" });
    return false;
  }
  if (files.some((f) => (f.type.includes("image") && f.file.size > MAX_IMAGE_SIZE) || (f.type.includes("video") && f.file.size > MAX_VIDEO_SIZE))) {
    toast({ title: "File Too Large", description: "Images < 5MB, Video < 50MB.", variant: "destructive" });
    return false;
  }
  return true;
};

const compressImages = async (files: TempMedia[]) => {
  const options = { maxSizeMB: 5, maxWidthOrHeight: 3200, useWebWorker: true };
  try {
    return await Promise.all(
      files.map(async (data) =>
        data.type.includes("image") ? { ...data, file: await imageCompression(data.file, options) } : data
      )
    );
  } catch (error) {
    toast({ title: "Compression Error", description: "Failed to compress files.", variant: "destructive" });
    return null;
  }
};

export const useCloudUploader = () => {
  const [loading, setLoading] = useState(false);
  const { getUploadUrls, uploadFiles } = useUploadFiles();

  const handleProjectImagesUpload = async (files: TempMedia[]) => {
    if (!validateFiles(files)) return null;

    const compressedFiles = files.some((f) => f.type.includes("image")) ? await compressImages(files) : files;
    if (!compressedFiles) return null;

    try {
      setLoading(true);
      const uploadUrls = await getUploadUrls(compressedFiles.map((item) => item.file));
      if (!uploadUrls) throw new Error("Failed to get upload URLs.");

      const uploadData = uploadUrls.map((url, i) => ({ uploadUrl: url.uploadUrl, file: compressedFiles[i].file }));
      const uploadedFilesData = uploadUrls.map((item) => ({ type: item.key.includes("video") ? "video" : "image", url: getFileUrl(item.key) }));

      const uploadResults = await uploadFiles(uploadData);
      if (!uploadResults.at(0).ok) throw new Error("File uploads failed.");

      return uploadedFilesData;
    } catch (error) {
      toast({ title: "Upload Error", description: error.message || "Something went wrong.", variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleProjectImagesUpload, loading };
};
