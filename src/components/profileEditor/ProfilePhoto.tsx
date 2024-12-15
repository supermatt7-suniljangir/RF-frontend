import React, { useState } from "react";

import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import { useDropzone } from "react-dropzone"; // Assuming you're using this for file drops
import Spinner from "@/app/loading";
import { useProfileUploader } from "@/features/upload/useProfileUploader";

const ProfilePhoto: React.FC = () => {
  const { user, setUser } = useUser();
  const [image, setImage] = useState<string | null>(user?.profile?.avatar || null);
  const { handleImageUpload, loading } = useProfileUploader(setImage, setUser, "avatar");

  // Use react-dropzone for handling drag and drop or file selection
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        await handleImageUpload(file);
      }
    },
  });

  return (
    <div
      className="relative w-32 h-32"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div
        className={`w-full h-full rounded-full relative border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer`}
      >
        {loading ? (
          <Spinner />
        ) : image ? (
          <Image
            fill
            src={image}
            alt="Uploaded profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-sm text-gray-500 text-center">Upload</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;
