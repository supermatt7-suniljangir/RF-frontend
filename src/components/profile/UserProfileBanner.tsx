"use client";

import { useEffect, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Wallpaper } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import { useProfileFilesUploader } from "@/features/cloudUpload/useProfileFilesUploader";

export default function UserProfileBanner() {
  const { user, setUser, isLoading } = useUser();
  const [bannerImage, setBannerImage] = useState<string | null>(
    user?.profile?.cover || null,
  );
  const { handleProfileFileUpload, loading: isUpdating } =
    useProfileFilesUploader(setBannerImage, setUser, "cover");
  // Determine which banner to show: uploaded file, current banner, or fallback
  useEffect(() => {
    if (user?.profile?.cover) {
      setBannerImage(user.profile.cover);
    }
  }, [bannerImage, user]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      await handleProfileFileUpload([file]);
    },
  } as DropzoneOptions);

  return (
    <Card className="mx-auto w-full rounded-none bg-muted">
      <CardContent className="relative w-full p-0">
        <div
          {...getRootProps()}
          className="relative flex h-[60vh] w-full cursor-pointer items-center justify-center p-0 md:h-96"
        >
          {isLoading || isUpdating ? (
            <Spinner />
          ) : bannerImage ? (
            <Image
              unoptimized
              src={bannerImage}
              alt="Banner"
              fill
              className="relative h-full w-full object-cover"
            />
          ) : (
            <div className="grid place-items-center text-center">
              <Wallpaper size={48} />
              <h2 className="text-2xl font-semibold">Banner Image</h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Optimal dimensions 3200x410px
              </p>
            </div>
          )}
          <input {...getInputProps()} />
        </div>
      </CardContent>
    </Card>
  );
}
