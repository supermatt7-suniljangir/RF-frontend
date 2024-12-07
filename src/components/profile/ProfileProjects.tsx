import { ProjectMini } from "@/types/project";
import React from "react";
import ProjectCard from "../common/ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
interface ProfileProjectProps {
  projects: ProjectMini[];
}

const ProfileProjects: React.FC<ProfileProjectProps> = ({ projects }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {projects?.length > 0 && projects?.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
      <CreateProjectCard />
    </div>
  );
};

export default ProfileProjects;
