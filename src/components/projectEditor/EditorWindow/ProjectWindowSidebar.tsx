"use client";
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import ProjectTags from './ProjectTags'
import ProjectTools from './ProjectTools';
import ProjectCategories from './ProjectCategories';
import ProjectCollaborators from './ProjectCollaborators';

const ProjectWindowSidebar = () => {

    return (
        <Card className='lg:w-3/5 w-full border-l shadow-none h-fit min-h-full rounded-none p-0'>
            <CardContent className='p-4'>
                <ProjectTags />
                <ProjectTools />
                <ProjectCategories />
                <ProjectCollaborators />
            </CardContent>
        </Card>
    )
}

export default ProjectWindowSidebar