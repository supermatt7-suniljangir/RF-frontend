import { useState } from "react";
import { useUploadFiles } from "@/features/upload/useUpload";
import { useUpdateUserProfile } from "@/features/user/useUpdateProfile";
import { User } from "@/types/user";
import { toast } from "@/hooks/use-toast";
import imageCompression from "browser-image-compression";

export const useProfileUploader = (
  setImage: (url: string | null) => void,
  setUser: (user: User) => void,
  type: "avatar" | "cover" // Add type for conditional payload
) => {
  const [loading, setLoading] = useState(false);
  const { getUploadUrl, uploadFile } = useUploadFiles();
  const { updateProfile } = useUpdateUserProfile();

  const handleImageUpload = async (file: File) => {
    // Validate file type
    if (!file.type.includes("image")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    const MAX_FILE_SIZE = type === "cover" ? 5 * 1024 * 1024 : 3 * 1024 * 1024;
    // Step 1: Check file size (limit 4MB for banner)
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${
          type === "cover" ? "5MB" : "3MB"
        }.`,
        variant: "destructive",
      });
      return;
    }

    let compressedFile = file;
    if (file.type.includes("image")) {
      try {
        const compressionOptions = {
          maxSizeMB: type === "cover" ? 5 : 3, // Larger size for banner
          maxWidthOrHeight: type === "cover" ? 3200 : 800, // Larger dimensions for banner
          useWebWorker: true,
        };
        compressedFile = await imageCompression(file, compressionOptions);
      } catch (error) {
        toast({
          title: "Error compressing image",
          description:
            "There was an error compressing the image. Please try again.",
          variant: "destructive",
        });
        console.error("Error compressing image:", error);
        return null;
      }
    }

    try {
      setLoading(true);
      const metadata = {
        filename: compressedFile.name,
        contentType: compressedFile.type,
      };
      const uploadResult = await getUploadUrl(metadata);

      if (!uploadResult) {
        toast({
          title: "Failed to get upload URL",
          description:
            "There was an issue fetching the upload URL. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { uploadUrl, key } = uploadResult;
      const uploadData = await uploadFile(uploadUrl, compressedFile);

      if (uploadData.ok) {
        const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
        const payload = {
          profile: {
            [type]: imageUrl, // Dynamically set avatar or cover
          },
        };

        const response = await updateProfile(payload);
        if (!response.success || !response?.data) {
          console.error("Failed to update profile", response);
          toast({
            title: "Failed to update profile",
            description:
              "There was an issue updating your profile. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        setImage(imageUrl);
        setUser(response.data);

        toast({
          title: `${type === "cover" ? "Banner" : "Profile photo"} updated`,
          description: `Your ${
            type === "cover" ? "banner" : "profile photo"
          } has been updated successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "An error occurred",
        description:
          "There was an error during the upload process. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleImageUpload, loading };
};
