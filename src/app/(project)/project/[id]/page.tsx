"use server";
import {Suspense} from "react";
import ProjectInfo from "@/components/project/Project";
import {ProjectType} from "@/types/project";
import React from "react";
import Spinner from "@/app/loading";
import {Metadata} from "next";
import {getProjectById} from "@/services/serverServices/project/getProjectById";

interface ProjectPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata(
    {params}: ProjectPageProps,
): Promise<Metadata> {
    const {id} = await params;
    const {success, data, message} = await getProjectById({id});

    if (!success || !data) {
        console.error("Failed to generate metadata for project:", message);
        return {
            title: "Project Not Found",
            description: "The requested project could not be found",
        };
    }
    const project = data as ProjectType;
    return {
        title: project.title,
        description: project?.description,
        openGraph: {
            title: project.title,
            description: project.description,
            images: [
                {
                    url: project?.thumbnail,
                    width: 800,
                    height: 600,
                    alt: project.title,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description: project?.description || "Project details",
            images: [project?.thumbnail || "/default-project-image.png"],
        },
    };
}

const Project = async ({params}: ProjectPageProps) => {
    const {id} = await params;

    const {success, data, message} = await getProjectById({id});
    console.log('refetched the data');
    if (!success || !data) {
        return (
            <div className="text-center w-full my-8 text-lg font-medium text-red-500">
                {message || "Project not found"}
            </div>
        );
    }

    const project = data as ProjectType;

    return (
        <Suspense fallback={<Spinner/>}>
            <ProjectInfo project={project}/>
        </Suspense>
    );
};

export default Project;
