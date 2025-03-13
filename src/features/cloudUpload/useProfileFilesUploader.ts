"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getFileUrl } from "@/lib/getFileUrl";
import { useUpdateUserProfile } from "@/features/profile/useUpdateProfile";
import { User } from "@/types/user";
import { Config } from "@/config/config";
import FilesUploadService from "@/services/clientServices/filesUpload/FilesUploadService";

export const useProfileFilesUploader = (
  setImage: (url: string | null) => void,
  setUser: (user: User) => void,
  type: "avatar" | "cover"
) => {
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useUpdateUserProfile();

  const handleProfileFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setLoading(true);

    try {
      const file = files[0];
      const maxSize = Config.FILE_LIMITS[type];
      if (file.size > maxSize) {
        throw new Error(
          `File must be smaller than ${type === "cover" ? "5MB" : "3MB"}.`
        );
      }
      if (!file.type.includes("image")) {
        throw new Error("File must be an image.");
      }

      const [uploadUrlData] = await FilesUploadService.getUploadUrls([file]);
      await FilesUploadService.uploadFiles([
        { uploadUrl: uploadUrlData.uploadUrl, file: file },
      ]);

      const imageUrl = getFileUrl(uploadUrlData.key);
      const response = await updateProfile({ profile: { [type]: imageUrl } });
      setImage(imageUrl);
      setUser(response.data);
      toast({
        title: `${type === "cover" ? "Banner" : "Profile photo"} updated`,
        description: "Successfully updated your profile.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleProfileFileUpload, loading };
};
