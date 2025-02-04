"use client";
import ProjectEditorProvider from '@/Providers/ProjectEditorContextWrapper'
import React, { FC } from 'react'
import { ProjectType } from '@/types/project'
import { useUser } from '@/contexts/UserContext'
import Spinner from '@/app/loading'
import EditorContainer from './EditorContainer';
interface ProjectEditorProps {
    initialData: ProjectType | null
}
const ProjectEditor: FC<ProjectEditorProps> = ({ initialData }) => {
    const { user, isLoading } = useUser();

    if (isLoading) return <Spinner />
    if (!user || (initialData && initialData.creator._id !== user._id)) return <div>
        <p className="text-center text-muted-foreground">
            You are not authorized to view this page.
        </p>
    </div>;
    return (
        <ProjectEditorProvider initialData={initialData}>
            <EditorContainer />
        </ProjectEditorProvider>
    )
}

export default ProjectEditor