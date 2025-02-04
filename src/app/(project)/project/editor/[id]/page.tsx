import Spinner from '@/app/loading';
import ProjectEditor from '@/components/projectEditor/ProjectEditor';

import { getProjectById } from '@/services/Projects/getProjectById';
import { ProjectType } from '@/types/project';
import React, { Suspense } from 'react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const Editor: React.FC<ProjectPageProps> = async ({ params }) => {
  const { id } = await params;
  let initialData: ProjectType | null = null;

  if (id !== "new") {
    initialData = await getProjectById({ id }); // Fetch project data by ID

    if (!initialData) throw new Error("failed to load the project");
  }

  return (
    <div className='w-full relative'>
      <Suspense fallback={<Spinner />}>
        <ProjectEditor initialData={initialData} />
      </Suspense>
    </div>
  );
};

export default Editor;

