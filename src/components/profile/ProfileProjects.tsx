import { ProjectMini } from "@/types/project";
import React from "react";
import ProjectCard from "../common/ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
interface ProfileProjectProps {
  projects: ProjectMini[];
}

const ProfileProjects: React.FC<ProfileProjectProps> = ({ projects }) => {
  return (
    <div className="grid w-full grid-cols-1 place-items-center sm:w-3/4 md:w-full md:grid-cols-2 gap-6 p-4 2xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
      <CreateProjectCard />
    </div>
  );
};

export default ProfileProjects;
