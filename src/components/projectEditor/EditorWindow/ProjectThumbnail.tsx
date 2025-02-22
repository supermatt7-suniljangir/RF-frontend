"use client";
import React, { useRef } from "react";
import { useEditor } from "@/contexts/ProjectEditorContext";
import { useUser } from "@/contexts/UserContext";
import ProjectCard from "../../common/ProjectCard";
import { Button } from "../../ui/button";
import { toast } from "@/hooks/use-toast";

const ProjectThumbnail: React.FC = () => {
    const { media, projectMetadata, updateProjectMetadata } = useEditor(); // Assuming setProjectMetadata is available in the context
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const tempProject: any = {
        title: projectMetadata.title,
        description: projectMetadata.description,
        thumbnail: projectMetadata.thumbnail.url ? projectMetadata.thumbnail.url : media.filter((m) => m.type === "image")[0].url,
        creator: {
            _id: user?._id || 123,
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

        // Ensure only one file is selected
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

        // Check for valid file type (image only)
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
        updateProjectMetadata({
            thumbnail: { url: thumbnailUrl, file, type:"image/thumbnail"},
        });
        event.target.value = "";
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="lg:w-2/5 w-1/2 h-full border-none rounded-none p-4">
            <h3 className="text-muted-foreground my-2 text-sm font-semibold">
                Project Thumbnail
            </h3>
            <div onClick={triggerFileInput}>
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
                className="rounded-none bg-muted text-muted-foreground block mx-auto my-4 text-sm"
                onClick={triggerFileInput}
            >
                Upload Image
            </Button>
        </div>
    );
};

export default ProjectThumbnail;
