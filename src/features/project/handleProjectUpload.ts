// hooks/useProjectUploader.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectStatus, ProjectUploadType } from "@/types/project";
import { useCloudUploader } from "@/features/upload/useFileUploader";
import { ProjectOperationResponse } from "@/types/others";
import { toast } from "@/hooks/use-toast";
import {
  createNewProject,
  updateProject,
} from "@/services/Projects/projectUploadService";

export const useProjectUploader = (initialData?: any) => {
  const router = useRouter();
  const { handleProjectImagesUpload } = useCloudUploader();
  const [isUploading, setIsUploading] = useState(false);

  const validateProject = (projectData: ProjectUploadType) => {
    if (
      !projectData.category ||
      !projectData.title ||
      projectData.media.length < 1
    ) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Incomplete project information",
        duration: 4000,
      });
      return false;
    }
    return true;
  };

  const handleMediaUpload = async (
    cloudUploadData: any,
    existingMedia: any[]
  ) => {
    const imagesToUpload = cloudUploadData.uploadMedia.filter((item: any) =>
      item.type.includes("image")
    );

    if (cloudUploadData.uploadThumbnail.file) {
      imagesToUpload.push(cloudUploadData.uploadThumbnail);
    }

    if (imagesToUpload.length === 0) {
      return existingMedia;
    }

    const uploadedMedia = await handleProjectImagesUpload(imagesToUpload);
    if (!uploadedMedia || uploadedMedia.length === 0) {
      throw new Error("Failed to upload project images.");
    }

    return [...existingMedia, ...uploadedMedia];
  };

  const uploadProjectHandler = async (
    projectData: ProjectUploadType,
    cloudUploadData: any,
    status: ProjectStatus
  ) => {
    try {
      setIsUploading(true);

      // Initial validation
      if (!validateProject(projectData)) {
        return null;
      }

      // Filter out blob URLs from existing media
      let updatedMedia = projectData.media.filter(
        (item) => !item.url.startsWith("blob:")
      );

      // Handle media uploads
      try {
        updatedMedia = await handleMediaUpload(cloudUploadData, updatedMedia);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload project images.",
          duration: 4000,
        });
        return null;
      }

      // Update project data with new media
      const finalProjectData = {
        ...projectData,
        media: updatedMedia,
        thumbnail:
          updatedMedia.find((item) => item.type === "image")?.url ||
          updatedMedia[0].url,
        status,
      };

      // Validate thumbnail
      if (!finalProjectData.thumbnail) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Project thumbnail is required.",
          duration: 4000,
        });
        return null;
      }

      // Create or update project
      const response = await (initialData?._id
        ? updateProject(finalProjectData)
        : createNewProject(finalProjectData));

      if (response?.data?._id) {
        router.push(`/project/${response.data._id}`);
      }

      return response;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while uploading the project. Please try again.",
        duration: 4000,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProjectHandler,
  };
};
