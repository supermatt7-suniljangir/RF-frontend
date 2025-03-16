"use server";
import React from "react";
import { User } from "@/types/user";
import { getProjectsLikedByUser } from "@/services/serverServices/likes/getProjectsLikedByUser";
import ProjectCard from "../common/ProjectCard";

interface ProfileProjectProps {
  user?: User;
}

const AppreciatedProjects: React.FC<ProfileProjectProps> = async ({ user }) => {
  const {
    success,
    data: likedProjects,
    message,
  } = await getProjectsLikedByUser({ userId: user?._id || "personal" });

  if (!success) {
    return (
      <p className="text-red-500 text-center w-full my-8">
        {message || "Failed to fetch appreciated projects"}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start w-full">
      {likedProjects?.length > 0 ? (
        likedProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))
      ) : (
        <p className="text-muted-foreground text-center w-full my-8">
          No Appreciated projects
        </p>
      )}
    </div>
  );
};

export default AppreciatedProjects;
