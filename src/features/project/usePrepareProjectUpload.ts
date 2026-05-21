"use client";
import { toast } from "@/hooks/use-toast";
import { ProjectUploadType, TempMedia, Thumbnail } from "@/types/project";
import { useProjectFilesUploader } from "@/features/cloudUpload/useProjectFilesUploader";
import { useProjectUpload } from "@/features/project/useProjectUpload";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { useProjectContext } from "@/contexts/ProjectContext";
import { useMediaUpload } from "@/contexts/MediaContext";

export const useProjectUploadHandler = (projectID?: string) => {
  const router = useRouter();
  const { createNew, updateExisting } = useProjectUpload();
  const { handleProjectFilesUpload } = useProjectFilesUploader();
  const isUpdating = !!projectID;
  // Access context directly in the hook instead of receiving as parameters
  const { updateUIState } = useProjectContext();
  const {
    newMedia,
    updateNewMedia,
    initialMedia,
    newThumbnail,
    initialThumbnail,
  } = useMediaUpload();

  const handleProjectUpload = async (projectData: ProjectUploadType) => {
    try {
      const newlyUploadedMedia = [];
      updateUIState({ isUploading: true });

      let updatedMedia = initialMedia;

      let updatedThumbnail = initialThumbnail;
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
          item.file,
      );

      // Check if thumbnail needs upload (only if it's a blob URL)
      const uploadThumbnail =
        newThumbnail && projectData?.thumbnail?.url.startsWith("blob:")
          ? projectData.thumbnail
          : undefined;
      const isThumbnailUpload = !!uploadThumbnail;

      // Upload files to cloud if needed
      if (filesToUpload.length > 0 || isThumbnailUpload) {
        const { media, thumbnail } = await handleProjectFilesUpload(
          filesToUpload,
          uploadThumbnail,
        );

        // update uploaded media
        newlyUploadedMedia.push(...media);
        if (thumbnail && thumbnail?.url) {
          updatedThumbnail = thumbnail;
        }

        // Add uploaded media to existing media
        updatedMedia = [...updatedMedia, ...newlyUploadedMedia];
      }

      const fallbackThumbnailThroughMedia = updatedMedia.find(
        (item) => item.type === "image",
      );
      const finalProjectData = {
        ...projectData,
        media: updatedMedia,
        thumbnail:
          updatedThumbnail ??
          initialThumbnail ??
          ({
            type: "image/thumbnail",
            url: fallbackThumbnailThroughMedia.url,
            key: fallbackThumbnailThroughMedia.key,
          } as Thumbnail),
      };

      // Send to API
      const res: ApiResponse = isUpdating
        ? await updateExisting(finalProjectData)
        : await createNew(finalProjectData);

      if (!res?.success) return;
      // Navigate to project page
      router.push(`/project/${res.data._id}`);
    } catch (error) {
      console.error("Project Upload Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "An error occurred while uploading the project. Please try again.",
        duration: 3000,
      });

      // Reset new media
      updateNewMedia(projectData.media as TempMedia[]);
    } finally {
      updateUIState({ isUploading: false });
    }
  };

  return { handleProjectUpload };
};
