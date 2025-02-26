"use client";
import React, { FC } from "react";
import { ProjectType } from "@/types/project";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import EditorContainer from "./EditorContainer";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { MediaUploadProvider } from "@/contexts/MediaContext";
import { UploadProjectProvider } from "@/contexts/UploadProjectContext";

interface ProjectEditorProps {
    initialData: ProjectType | null;
}

const ProjectEditor: FC<ProjectEditorProps> = ({ initialData }) => {
    const { user, isLoading } = useUser();

    if (isLoading) return <Spinner />;
    if (!user || (initialData && initialData.creator._id !== user._id))
        return (
            <div>
                <p className="text-center text-muted-foreground">
                    You are not authorized to view this page.
                </p>
            </div>
        );

    return (
        <ProjectProvider initialData={initialData}>
            <MediaUploadProvider
                initialMediaData={initialData?.media || []}
                initialThumbnailData={initialData?.thumbnail || ""}
            >
                <UploadProjectProvider projectID={initialData?._id}>
                    <EditorContainer />
                </UploadProjectProvider>
            </MediaUploadProvider>
        </ProjectProvider>
    );
};

export default ProjectEditor;
