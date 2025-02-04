import { useState } from "react";
import { useUploadFiles } from "@/features/upload/useUpload";
import { useUpdateUserProfile } from "@/features/user/useUpdateProfile";
import { User } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";
import { getFileUrl } from "@/lib/getFileUrl";

export const useProfileUploader = (
  setImage: (url: string | null) => void,
  setUser: (user: User) => void,
  type: "avatar" | "cover"
) => {
  const [loading, setLoading] = useState(false);
  const { getUploadUrls, uploadFiles } = useUploadFiles();
  const { updateProfile } = useUpdateUserProfile();

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const isImage = files[0].type.includes("image");
    const MAX_SIZE = type === "cover" ? 5 * 1024 * 1024 : 3 * 1024 * 1024;

    // Step 1: Validate files
    if (files.some((file) => file.size > MAX_SIZE)) {
      toast({
        title: "File too large",
        description: `Each file must be smaller than ${
          type === "cover" ? "5MB" : "3MB"
        }.`,
        variant: "destructive",
      });
      return;
    }

    let processedFiles = files;

    // Step 2: Compress images (if applicable)
    if (isImage) {
      try {
        const compressionOptions = {
          maxSizeMB: type === "cover" ? 5 : 3,
          maxWidthOrHeight: type === "cover" ? 3200 : 800,
          useWebWorker: true,
        };
        processedFiles = await Promise.all(
          files.map((file) => imageCompression(file, compressionOptions))
        );
      } catch (error) {
        toast({
          title: "Compression Error",
          description: "Failed to compress files. Try again.",
          variant: "destructive",
        });
        console.error("Compression error:", error);
        return;
      }
    }

    try {
      setLoading(true);
      // Step 3: Get upload URLs
      const uploadUrls = await getUploadUrls(processedFiles);
      if (!uploadUrls) throw new Error("Failed to get upload URLs.");

      // Step 4: Upload files
      const uploadData = uploadUrls.map((url, i) => ({
        uploadUrl: url.uploadUrl,
        file: processedFiles[i],
      }));

      const uploadResults = await uploadFiles(uploadData);
      if (!uploadResults) throw new Error("File uploads failed.");

      const imageUrl: string = getFileUrl(uploadUrls[0].key);
      const payload = { profile: { [type]: imageUrl } };

      const response = await updateProfile(payload);
      if (!response.success || !response?.data)
        throw new Error("Profile update failed.");
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

  return { handleFileUpload, loading };
};
