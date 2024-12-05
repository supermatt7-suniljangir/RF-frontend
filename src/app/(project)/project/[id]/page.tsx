import { Suspense } from "react";
import ProjectInfo from "@/components/project/Project";
import { ProjectType } from "@/types/project";
import React from "react";
import { fetchProjectById } from "@/features/project/useGetProjectById";
import Spinner from "@/app/loading";
import { Metadata, ResolvingMetadata } from "next";

interface ProjectResponse {
  data: ProjectType;
  success: boolean;
}

interface ProjectPageProps {
  params: { id: string };
}

// Dynamic Metadata Generation
export async function generateMetadata(
  { params }: ProjectPageProps,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  const project: ProjectResponse | null = await fetchProjectById({
    id: "674e9db7800d87b1df8c8982",
  });

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
  const project: ProjectResponse | null = await fetchProjectById({
    id: "674e9db7800d87b1df8c8982",
  });

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
