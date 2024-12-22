// components/ProjectHeader/index.tsx
import CreatorMiniInfo from "./CreatorMiniInfo";
import InteractionButtons from "./InteractionButtons";
import type { ProjectType } from "@/types/project";

interface ProjectHeaderProps {
  project: ProjectType;
}

const ProjectHeader = ({ project }: ProjectHeaderProps) => {
  return (
    <div className=" w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
      </div>
      <div className="flex items-center justify-between">
        <CreatorMiniInfo creator={project.creator} />
        <div className="flex items-center gap-4">
          <InteractionButtons stats={project.stats} />
        </div>
      </div>
    </div>
  );
};
export default ProjectHeader;
