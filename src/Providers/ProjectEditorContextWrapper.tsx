"use client";
import React, { ReactNode } from "react";
import { EditorProvider } from "../contexts/ProjectEditorContext";
import { ProjectType } from "@/types/project";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

interface ProjectEditorProviderProps {
    children: ReactNode,
    initialData?: Partial<ProjectType> | null;
}

const ProjectEditorProvider: React.FC<ProjectEditorProviderProps> = ({ children, initialData }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    if (isMobile) {
        return (
            <div>
                <p className="text-center text-muted-foreground">
                    This page is not supported on mobile devices. Please use a desktop device.
                </p>
            </div>
        );
    }
    return (
        <EditorProvider initialData={initialData}>
            {children}
        </EditorProvider>
    );
};

export default ProjectEditorProvider;
