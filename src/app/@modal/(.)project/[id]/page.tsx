"use server";

import { Suspense } from "react";

import Spinner from "@/app/loading";
import { ProjectType } from "@/types/project";

import { getProjectById } from "@/services/serverServices/project/getProjectById";

import ProjectModalUI from "@/components/project/ProjectModalUI";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const ProjectModalRoute = async ({ params }: ProjectPageProps) => {
  const { id } = await params;

  const { success, data, message } = await getProjectById({ id });

  if (!success || !data) {
    return (
      <div className="my-8 w-full text-center text-lg font-medium text-red-500">
        {message || "Project not found"}
      </div>
    );
  }

  const project = data as ProjectType;

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectModalUI project={project} />
    </Suspense>
  );
};

export default ProjectModalRoute;
