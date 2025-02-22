"use server"
import React from "react";
import { User } from "@/types/user";
import { getProjectsLikedByUser } from "@/services/likes/getProjectsLikedByUser";
import ProjectCard from "../common/ProjectCard";
interface ProfileProjectProps {
    user?: User;
}

const AppreciatedProjects: React.FC<ProfileProjectProps> = async ({ user }) => {
    // receiving the user through props means that its a view of external profile and not the current user's
    const likedProjects = await getProjectsLikedByUser({ userId: user?._id });

    return (
        <div className="flex flex-wrap gap-4 justify-center md:justiy-start w-full">
            {likedProjects.length > 0 ? (
                likedProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))
            ) : (
                <p className="text-muted-foreground">No Appreciated projects</p>
            )}

        </div>
    );
};

export default AppreciatedProjects;
