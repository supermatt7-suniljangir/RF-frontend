import { MiniProject, ProjectStatus } from "@/types/project";
import React from "react";
import ProjectCard from "../common/ProjectCard";
interface ProfileProjectProps {
  projects: MiniProject[];
}

const DraftProjects: React.FC<ProfileProjectProps> = ({ projects }) => {
  const publishProjects = projects?.filter(
    (project) => project.status === ProjectStatus.DRAFT,
  );
  return (
    <div className="md:justiy-start flex w-full flex-wrap justify-center gap-4">
      {publishProjects?.length > 0 ? (
        publishProjects?.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))
      ) : (
        <p className="text-muted-foreground">No draft projects</p>
      )}
    </div>
  );
};

export default DraftProjects;
