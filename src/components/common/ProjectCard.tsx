"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Project2 from "@/media/project-2.jpg";
import Link from "next/link";
import { ProjectMini } from "@/types/project";
import { useUser } from "@/contexts/UserContext";
interface ProjectCardProps {
  project: ProjectMini;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { user } = useUser();
  const [hovered, setHovered] = useState<boolean>(false);
  const isOwner = user?._id === project?.creator?._id;
  return (
    <Card
      className={"w-full max-w-[380px] h-auto relative p-0 rounded-none"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/project/${project._id}`}>
        <div className="relative h-64 overflow-hidden rounded-none ">
          <Image
            src={Project2}
            alt={project.title}
            fill
            className="h-full w-full object-cover"
          />
          {hovered && (
            <CardHeader className="absolute w-full h-36 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:opacity-100 transition-opacity duration-300">
              <CardTitle className="absolute bottom-4 left-4 text-white text-lg font-medium">
                {project.title} 
              </CardTitle>
            </CardHeader>
          )}
        </div>
      </Link>
      <CardContent className="px-4 py-1 mt-1">
        <div className="flex justify-between">
          {!isOwner && (
            <Link href={`/profile/${project?.creator?._id}`} className="w-3/4 block">
              <div className="flex space-x-2">
                {project.creator?.profile?.avatar && <Image
                  src={project.creator.profile.avatar}
                  alt={"something"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />}
                <p>{project?.creator?.fullName}</p>
              </div>
            </Link>
          )}
          <div className="flex space-x-4 justify-between flex-grow">
            <div className="flex items-center space-x-1">
              <Eye size={18} />
              <span>{project.stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart size={18} className="text-primary" />
              <span>{project.stats.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
