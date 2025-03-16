import { MiniProject, ProjectStatus } from "@/types/project";
import React from "react";
import ProjectCard from "../common/ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
interface ProfileProjectProps {
  projects: MiniProject[];
}

const DraftProjects: React.FC<ProfileProjectProps> = ({ projects }) => {
  const publishProjects = projects?.filter(
    (project) => project.status === ProjectStatus.DRAFT,
  );
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justiy-start w-full">
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
