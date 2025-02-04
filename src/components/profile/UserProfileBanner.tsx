
"use client";

import { useEffect, useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Wallpaper } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import { useProfileUploader } from "@/features/upload/useProfileUploader";


export default function UserProfileBanner() {
  const { user, setUser, isLoading } = useUser();
  const [bannerImage, setBannerImage] = useState<string | null>(
    user?.profile?.cover || null
  );
  const { handleFileUpload, loading: isUpdating } = useProfileUploader(
    setBannerImage,
    setUser,
    "cover"
  );
  // Determine which banner to show: uploaded file, current banner, or fallback
  useEffect(() => {
    if (user?.profile?.cover) {
      setBannerImage(user.profile.cover);
    } else {
      setBannerImage(null);
    }
  }, [bannerImage, user]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      await handleFileUpload([file]);
    },
  } as DropzoneOptions);



  return <Card className="w-full bg-muted mx-auto rounded-none">
    <CardContent className="w-full p-0 relative">
      <div
        {...getRootProps()}
        className="flex items-center w-full p-0 justify-center h-56 md:h-64 cursor-pointer relative"
      >
        {isLoading || isUpdating ? <Spinner /> : bannerImage ? (
          <Image
            src={bannerImage}
            alt="Banner"
            fill
            className="w-full h-full object-cover relative"
          />
        ) : (
          <div className="grid place-items-center text-center">
            <Wallpaper size={48} />
            <h2 className="text-2xl font-semibold">Banner Image</h2>
            <p className="text-muted-foreground text-lg mt-2">
              Optimal dimensions 3200x410px
            </p>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    </CardContent>
  </Card>


}
