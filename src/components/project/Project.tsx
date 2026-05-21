import ProjectHeader from "./ProjectHeader";
import MediaViewer from "./MediaViewer";
import { ProjectType } from "@/types/project";
import ProjectBottomDetails from "./ProjectBottomDetails";
import CreatorInfo from "./CreatorInfo";
import CommentsContainer from "../comments/CommentsContainer";
import ProjectDescription from "./ProjectDescription";
import CopyrightDetails from "./CopyrightDetails";

const ProjectInfo = async ({
  project,
  isModal = false,
}: {
  project: ProjectType;
  isModal?: boolean;
}) => {
  return (
    <main
      className={`mx-auto flex w-full flex-col items-center justify-center ${!isModal && "px-4 py-6 md:px-10 md:py-8 lg:w-[95%] xl:w-[90%]"}`}
    >
      {" "}
      <div className="mb-4 flex w-full items-end justify-center">
        <ProjectHeader project={project} isModal={isModal} />
      </div>
      <MediaViewer media={project.media || []} />
      {/* details */}
      <ProjectDescription project={project} />
      <div className="flex w-full flex-col-reverse items-center justify-center bg-card py-4 shadow-md md:flex-row md:p-0">
        <CreatorInfo creator={project.creator} />
        <ProjectBottomDetails project={project} />
      </div>
      {/* the comments section with sunil jangir */}
      <CommentsContainer project={project} />
      <CopyrightDetails copyright={project.copyright} />
    </main>
  );
};

export default ProjectInfo;

// hii there github copilot
