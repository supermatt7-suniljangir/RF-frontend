import Spinner from '@/app/loading';
import ProjectEditor from '@/components/projectEditor/ProjectEditor';
import { ApiResponse } from '@/lib/ApiResponse';
import { getProjectById } from '@/services/serverServices/project/getProjectById';
import { ProjectType } from '@/types/project';
import React, { Suspense } from 'react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const Editor: React.FC<ProjectPageProps> = async ({ params }) => {
  const { id } = await params;

  if (id === "new") {
    return (
      <div className="w-full relative">
        <Suspense fallback={<Spinner />}>
          <ProjectEditor initialData={null} />
        </Suspense>
      </div>
    );
  }

  const { success, data, message } = await getProjectById({ id });

  if (!success || !data) {
    return (
      <div className="text-center w-full my-8 text-lg font-medium text-red-500">
        {message || "Project not found"}
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <Suspense fallback={<Spinner />}>
        <ProjectEditor initialData={data as ProjectType} />
      </Suspense>
    </div>
  );
};

export default Editor;
