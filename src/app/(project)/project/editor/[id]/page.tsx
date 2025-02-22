import Spinner from '@/app/loading';
import ProjectEditor from '@/components/projectEditor/ProjectEditor';
import { ApiResponse } from '@/lib/ApiResponse';

import { getProjectById } from '@/services/Projects/getProjectById';
import { ProjectType } from '@/types/project';
import React, { Suspense } from 'react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const Editor: React.FC<ProjectPageProps> = async ({ params }) => {
  const { id } = await params;
  let projectRes: ApiResponse;

  if (id !== "new") {
    projectRes = await getProjectById({ id });
    if (!projectRes?.success || !projectRes?.data) throw new Error(`project not found: ${projectRes.message}`);
  }

  return (
    <div className='w-full relative'>
      <Suspense fallback={<Spinner />}>
        <ProjectEditor initialData={projectRes?.data || null} />
      </Suspense>
    </div>
  );
};

export default Editor;

