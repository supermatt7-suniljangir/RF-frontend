import { Suspense } from "react";
import ProjectInfo from "@/components/project/Project";
import { ProjectType } from "@/types/project";
import React from "react";
import Spinner from "@/app/loading";
import { Metadata } from "next";
import { getProjectById } from "@/services/Projects/getProjectById";

interface ProjectResponse {
  data: ProjectType;
  success: boolean;
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProjectPageProps,
): Promise<Metadata> {
  const { id } = await params;
  const project: ProjectResponse | null = await getProjectById({ id });
  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found",
    };
  }

  return {
    title: project.data.title,
    description: project.data.description,

    openGraph: {
      title: project.data.title,
      description: project.data.description,
      images: [
        {
          url: project.data.thumbnail,
          width: 800,
          height: 600,
          alt: project.data.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.data.title,
      description: project.data.description || "Project details",
      images: [project.data.thumbnail || "/default-project-image.png"],
    },
  };
}

const Project = async ({ params }: ProjectPageProps) => {
  const { id } = await params;
  const project: ProjectResponse | null = await getProjectById({ id });

  if (!project) {
    throw new Error("Project not found");
  }

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectInfo project={project.data} />
    </Suspense>
  );
};

export default Project;
