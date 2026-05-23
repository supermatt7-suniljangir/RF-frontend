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
      <p className="my-8 w-full text-center text-red-500">
        {message || "Failed to fetch appreciated projects"}
      </p>
    );
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-4 md:justify-start">
      {likedProjects?.length > 0 ? (
        likedProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))
      ) : (
        <p className="my-8 w-full text-center text-muted-foreground">
          No Appreciated projects
        </p>
      )}
    </div>
  );
};

export default AppreciatedProjects;
