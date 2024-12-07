"use client";
import { useState } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallpaper, X } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";

interface ProfileBannerProps {
  cover?: string | null;
}

export default function ProfileBanner({ cover }: ProfileBannerProps) {
  const { user, isLoading } = useUser();
  const [bannerImage, setBannerImage] = useState<string | File | null>(
    cover || user?.profile?.cover || null
  );
  const [isHovered, setIsHovered] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      setBannerImage(acceptedFiles[0]);
    },
  } as DropzoneOptions);

  const handleRemoveBanner = () => {
    setBannerImage(null);
  };

  return (
    <Card
      className="w-full bg-muted mx-auto rounded-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="w-full p-0 relative">
        <div
          {...getRootProps()}
          className="flex items-center w-full p-0 justify-center h-56 md:h-64 cursor-pointer relative"
        >
          {isLoading ? <Spinner /> :
            bannerImage && !isLoading ? (
              typeof bannerImage === "string" ? (
                <Image
                  src={bannerImage}
                  alt="Banner"
                  fill
                  className="w-full h-full object-cover relative"
                />
              ) : (
                <Image
                  src={URL.createObjectURL(bannerImage)}
                  alt="Banner"
                  fill
                  className="w-full h-full object-cover relative"
                />
              )
            ) : (
              <div className="grid place-items-center text-center">
                <Wallpaper size={48} />
                <h2 className="text-2xl font-semibold">Banner Image</h2>
                <p className="text-muted-foreground text-lg mt-2">
                  Optimal dimensions 3200x410px
                </p>
              </div>
            )}
          {/* {bannerImage && !isLoading ? (
            typeof bannerImage === "string" ? (
              <Image
                src={bannerImage}
                alt="Banner"
                fill
                className="w-full h-full object-cover relative"
              />
            ) : (
              <Image
                src={URL.createObjectURL(bannerImage)}
                alt="Banner"
                fill
                className="w-full h-full object-cover relative"
              />
            )
          ) : (
            <div className="grid place-items-center text-center">
              <Wallpaper size={48} />
              <h2 className="text-2xl font-semibold">Banner Image</h2>
              <p className="text-muted-foreground text-lg mt-2">
                Optimal dimensions 3200x410px
              </p>
            </div>
          )} */}
          <input {...getInputProps()} />
        </div>
        {isHovered && bannerImage && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <Button
              variant="destructive"
              onClick={handleRemoveBanner}
              className="mr-4"
            >
              <X className="w-5 h-5" />
              Remove Banner
            </Button>
            <Button variant={"secondary"} {...getRootProps()}>
              Replace Banner
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
