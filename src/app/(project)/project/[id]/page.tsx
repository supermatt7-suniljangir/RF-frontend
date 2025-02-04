import { Suspense } from "react";
import ProjectInfo from "@/components/project/Project";
import { ProjectType } from "@/types/project";
import React from "react";
import Spinner from "@/app/loading";
import { Metadata } from "next";
import { getProjectById } from "@/services/Projects/getProjectById";


interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProjectPageProps,
): Promise<Metadata> {
  const { id } = await params;
  const project: ProjectType | null = await getProjectById({ id });
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found",
    };
  }

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

const Project = async ({ params }: ProjectPageProps) => {
  const { id } = await params;
  const project: ProjectType | null = await getProjectById({ id });

  if (!project) {
    throw new Error("Project not found");
  }

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectInfo project={project} />
    </Suspense>
  );
};

export default Project;
