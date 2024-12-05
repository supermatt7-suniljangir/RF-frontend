import ActionButtons from "./ActionButtons";
import ProjectHeader from "./ProjectHeader";
import MediaViewer from "./MediaViewer";
import { ProjectType } from "@/types/project";

const ProjectInfo = async ({ project }: { project: ProjectType }) => {
  return (
    <main className="w-full sm:p-4 md:p-6">
      <div className="flex items-end mb-4 w-full justify-center">
        <ProjectHeader project={project} />
        <ActionButtons />
      </div>
      <MediaViewer media={project.media || []} />
    </main>
  );
};

export default ProjectInfo;
