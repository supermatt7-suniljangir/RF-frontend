"use client";
import React from "react";
import Image from "next/image";
import VideoPlayer from "../project/VideoPlayer";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMediaUpload } from "@/contexts/MediaContext";

const ProjectMedia = () => {
    // Retrieve media states and removal function from the new MediaContext.
    const { initialMedia, newMedia, removeMedia } = useMediaUpload();

    // Combine initial (existing) media and newly uploaded media.
    const media = [...initialMedia, ...newMedia];

    // Remove media only if it exists in the new media list.
    const handleRemoveMedia = (item: any) => {
        if (newMedia.find((m) => m.url === item.url) || initialMedia.find((m) => m.url === item.url)) {
            removeMedia(item);

        }
    };

    return (
        <div className="w-full">
            {media.map((item, index) => (
                <div key={index} className="p-2 md:p-0 relative">
                    <Button
                        onClick={() => handleRemoveMedia(item)}
                        variant="destructive"
                        className="absolute p-2 h-auto w-auto top-2 right-2 z-10"
                    >
                        <Trash2 className="w-6 h-6" />
                    </Button>
                    {item.type === "image" ? (
                        <div className="relative">
                            <Image
                                sizes="(max-width: 640px) 100vw, 640px"
                                src={item.url}
                                alt={`Media ${index + 1}`}
                                className="rounded h-auto w-full"
                                width={0} // Let Next.js dynamically calculate dimensions.
                                height={0}
                            />
                        </div>
                    ) : (
                        // Use the item's URL for video playback.
                        <VideoPlayer url={item.url} playing={false} muted={true} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProjectMedia;
