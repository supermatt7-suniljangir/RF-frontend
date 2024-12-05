"use client";
import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const ProfilePhoto: React.FC = () => {
  const { user } = useUser();
  const [image, setImage] = useState<string | null>(
    user.profile.avatar || null
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <div {...getRootProps()} className="relative w-32 h-32">
      <input {...getInputProps()} />
      <div
        className={`w-full h-full rounded-full border-2 border-dashed flex items-center relative justify-center overflow-hidden cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        {image ? (
          // Show uploaded image
          <Image
            fill
            src={image}
            alt="Uploaded profile"
            className="w-full h-full object-cover relative"
          />
        ) : (
          // Show placeholder
          <p className="text-sm text-gray-500 text-center">Upload</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePhoto;
