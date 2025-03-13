"use client";
import React, {useRef} from "react";
import {useUser} from "@/contexts/UserContext";
import {useMediaUpload} from "@/contexts/MediaContext";
import ProjectCard from "../../common/ProjectCard";
import {Button} from "../../ui/button";
import {toast} from "@/hooks/use-toast";
import {useProjectContext} from "@/contexts/ProjectContext";

const ProjectThumbnail: React.FC = () => {
    const {initialThumbnail, newThumbnail, newMedia, updateNewThumbnail} = useMediaUpload();
    const {projectMetadata} = useProjectContext();
    const {user} = useUser();
    const fileInputRef = useRef<HTMLInputElement | null>(null);


    const tempProject: any = {
        title: projectMetadata.title,
        description: projectMetadata.description,
        thumbnail: newThumbnail ? newThumbnail.url : initialThumbnail ? initialThumbnail : newMedia.find((media) => media.type === "image")?.url,
        creator: {
            _id: user?._id || "123",
            fullName: user?.fullName || "John Doe",
            avatar: user?.profile?.avatar,
        },
        stats: {
            views: 0,
            likes: 0,
        },
    };

    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        // Allow only one file
        if (files.length > 1) {
            toast({
                variant: "destructive",
                title: "Error processing file",
                description: "Please select only one file.",
                duration: 4000,
            });
            event.target.value = "";
            return;
        }

        const file = files[0];

        // Validate image file type
        if (!file?.type.startsWith("image/")) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Only image files are allowed.",
                duration: 4000,
            });
            event.target.value = "";
            return;
        }

        const thumbnailUrl = URL.createObjectURL(file);

        // Update media with new thumbnail
        updateNewThumbnail({
            url: thumbnailUrl,
            file,
            type: "image/thumbnail",
        });

        event.target.value = "";
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className=" lg:w-[420px] h-full p-4">
            <h3 className="text-muted-foreground my-2 text-sm font-semibold">
                Project Thumbnail
            </h3>
            <div
                onClick={triggerFileInput}
                className="cursor-pointer p-4"
            >
                <ProjectCard
                    project={tempProject}
                    renderUser={false}
                    styles="pointer-events-none"
                />
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
            />

            <Button
                variant="ghost"
                className=" block mx-auto my-4 text-sm"
                onClick={triggerFileInput}
            >
                Upload Thumbnail
            </Button>
        </div>
    );
};

export default ProjectThumbnail;
