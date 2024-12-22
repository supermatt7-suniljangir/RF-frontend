import ActionButtons from "./ActionButtons";
import ProjectHeader from "./ProjectHeader";
import MediaViewer from "./MediaViewer";
import { ProjectType } from "@/types/project";
import ProjectBottomDetails from "./ProjectBottomDetails";
import CreatorInfo from "./CreatorInfo";
import CommentsContainer from "../comments/CommentsContainer";

const ProjectInfo = async ({ project }: { project: ProjectType }) => {
  return (
    <main className="w-full md:w-[90%] mx-auto sm:p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="flex items-end mb-4 w-full justify-center">
        <ProjectHeader project={project} />
        <ActionButtons />
      </div>
      <MediaViewer media={project.media || []} />
      <div className="flex w-full bg-card shadow-md flex-col-reverse md:flex-row py-4 md:p-0 justify-center items-center"> <CreatorInfo creator={project.creator} />
        <ProjectBottomDetails project={project} /></div>
      {/* the comments section with sunil jangir */}
      <CommentsContainer project={project} />
    </main>
  );
};

export default ProjectInfo;

// hii there github copilot