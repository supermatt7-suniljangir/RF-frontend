"use client";
import { toast } from "@/hooks/use-toast";
import { ProjectUploadType, TempMedia, Thumbnail } from "@/types/project";
import { useProjectFilesUploader } from "@/features/cloudUpload/useProjectFilesUploader";
import { useProjectUpload } from "@/features/project/useProjectUpload";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/lib/ApiResponse";
import { ProjectMetadata } from "@/types/contexts";

export const useProjectUploadHandler = (initialData?: any) => {
  const router = useRouter();
  const { createNew, updateExisting } = useProjectUpload();
  const { handleProjectFilesUpload } = useProjectFilesUploader();

  const handleProjectUpload = async (
    projectData: ProjectUploadType,
    cloudUploadData: { uploadMedia: TempMedia[]; uploadThumbnail: any },
    setMedia: (media: any) => void,
    updateMetadata: (metadata: ProjectMetadata) => void,
    updateUIState: (state: { isUploading: boolean }) => void
  ) => {
    try {
      let currentThumbnail = projectData.thumbnail as Thumbnail;
      let uploadedMedia = [];
      updateUIState({ isUploading: true });
      let updatedMedia = projectData.media.filter(
        (item) => !item.url.startsWith("blob:")
      );
      const isEditing = !!initialData?._id;

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

      const filesToUpload = cloudUploadData.uploadMedia.filter(
        (item) => item.type.includes("image") || item.type.includes("video")
      );
      let uploadThumbnail = cloudUploadData.uploadThumbnail;
      let isThumbnailUpload =
        uploadThumbnail &&
        uploadThumbnail.url.startsWith("blob:") &&
        uploadThumbnail.file
          ? true
          : false;

      if (filesToUpload.length > 0 || isThumbnailUpload) {
        uploadedMedia = await handleProjectFilesUpload(
          filesToUpload,
          isThumbnailUpload ? uploadThumbnail : undefined
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
        updatedMedia = [
          ...updatedMedia,
          ...uploadedMedia.filter((item) => item.type !== "image/thumbnail"),
        ] as any;
        setMedia(updatedMedia);
      }

      projectData.media = updatedMedia;
      let uploadedthumbnail = uploadedMedia.find(
        (Item) => Item.type === ("image/thumbnail" as any)
      );

      // if it is, check if it was uploaded
      if (
        uploadedthumbnail ||
        (uploadThumbnail && currentThumbnail.url.startsWith("blob:"))
      ) {
        // if it was uploaded, update the projectData.thumbnail
        projectData.thumbnail = uploadedthumbnail.url as any;
      } else if (
        !currentThumbnail.url &&
        !uploadedthumbnail &&
        updatedMedia.some((item) => item.type === "image")
      ) {
        projectData.thumbnail = updatedMedia.find(
          (item) => item.type === "image"
        ).url as any;
      }

      // if it wasn't uploaded, use the original projectData.thumbnail
      else {
        projectData.thumbnail = currentThumbnail.url as any;
      }

      if (!projectData.thumbnail) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Project thumbnail is required.",
          duration: 4000,
        });
        return;
      }
      updateMetadata({
        thumbnail: {
          url: projectData.thumbnail,
          file: null,
          type: "image/thumbnail",
        } as Thumbnail,
      } as ProjectMetadata);

      const res: ApiResponse = isEditing
        ? await updateExisting(projectData)
        : await createNew(projectData);
      if (!res?.success) return;
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
    } finally {
      updateUIState({ isUploading: false });
    }
  };

  return { handleProjectUpload };
};
