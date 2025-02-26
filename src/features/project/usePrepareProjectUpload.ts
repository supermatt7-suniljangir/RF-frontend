"use client";
import { toast } from "@/hooks/use-toast";
import { ProjectUploadType, TempMedia, Thumbnail } from "@/types/project";
import { useProjectFilesUploader } from "@/features/cloudUpload/useProjectFilesUploader";
import { useProjectUpload } from "@/features/project/useProjectUpload";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/lib/ApiResponse";
import { ProjectMetadata } from "@/types/contexts";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useMediaUpload } from "@/contexts/MediaContext";

export const useProjectUploadHandler = (projectID?: string) => {
  const router = useRouter();
  const { createNew, updateExisting } = useProjectUpload();
  const { handleProjectFilesUpload } = useProjectFilesUploader();
  const isUpdating = !!projectID;
  // Access context directly in the hook instead of receiving as parameters
  const { updateProjectMetadata, updateUIState } = useProjectContext();
  const { newMedia, updateNewMedia, updateNewThumbnail } = useMediaUpload();

  const handleProjectUpload = async (projectData: ProjectUploadType) => {
    try {
      let currentThumbnail = projectData.thumbnail as Thumbnail;
      let uploadedMedia = [];
      updateUIState({ isUploading: true });

      // Filter out blob URLs from initial media
      let updatedMedia = projectData.media.filter(
        (item) => !item.url.startsWith("blob:")
      );

      // Validation
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
        return;
      }

      // Prepare files for cloud upload (only new media with blob URLs)
      const filesToUpload = newMedia.filter(
        (item) =>
          item.url.startsWith("blob:") &&
          (item.type.includes("image") || item.type.includes("video")) &&
          item.file
      );

      // Check if thumbnail needs upload (only if it's a blob URL)
      const uploadThumbnail =
        currentThumbnail &&
        currentThumbnail.url.startsWith("blob:") &&
        currentThumbnail.file
          ? currentThumbnail
          : undefined;

      const isThumbnailUpload = !!uploadThumbnail;

      // Upload files to cloud if needed
      if (filesToUpload.length > 0 || isThumbnailUpload) {
        uploadedMedia = await handleProjectFilesUpload(
          filesToUpload,
          uploadThumbnail
        );

        if (!uploadedMedia || uploadedMedia.length === 0) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload project images.",
            duration: 4000,
          });
          return;
        }

        // Add uploaded media to existing media
        updatedMedia = [
          ...updatedMedia,
          ...uploadedMedia.filter((item) => item.type !== "image/thumbnail"),
        ] as any;
      }

      // Update project data with uploaded media
      projectData.media = updatedMedia;

      // Handle thumbnail logic
      let uploadedThumbnail = uploadedMedia.find(
        (item) => item.type === ("image/thumbnail" as any)
      );

      if (uploadedThumbnail) {
        // Use newly uploaded thumbnail
        projectData.thumbnail = uploadedThumbnail.url as any;
      } else if (
        !currentThumbnail.url &&
        updatedMedia.some((item) => item.type === "image")
      ) {
        // Fall back to first image if no thumbnail specified
        projectData.thumbnail = updatedMedia.find(
          (item) => item.type === "image"
        ).url as any;
      } else {
        // Use existing thumbnail URL
        projectData.thumbnail = currentThumbnail.url as any;
      }

      // Validate thumbnail
      if (!projectData.thumbnail) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Project thumbnail is required.",
          duration: 4000,
        });
        return;
      }

      // Send to API
      const res: ApiResponse = isUpdating
        ? await updateExisting(projectData)
        : await createNew(projectData);

      if (!res?.success) return;

      // Navigate to project page
      router.push(`/project/${res.data._id}`);
    } catch (error) {
      console.error("Project Upload Error:", error);
      console.log("Project Data:", projectData.media, projectData.thumbnail);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while uploading the project. Please try again.",
        duration: 3000,
      });
      updateNewThumbnail({
        url: projectData.thumbnail as string,
        file: undefined,
        type: "image/thumbnail",
      });
      // Reset new media
      updateNewMedia(projectData.media as TempMedia[]);
    } finally {
      updateUIState({ isUploading: false });
    }
  };

  return { handleProjectUpload };
};
