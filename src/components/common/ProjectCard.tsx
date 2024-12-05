"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Project2 from "@/media/project-2.jpg";
import Link from "next/link";
import { ProjectMini } from "@/types/project";
interface ProjectCardProps {
  project: ProjectMini;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  return (
    <Card
      className={"w-full max-w-[400px] h-auto relative p-0 rounded-none"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`project/dfd`}>
        <div className="relative h-64 overflow-hidden rounded-t-md ">
          <Image
            src={Project2}
            alt={project.title}
            fill
            className="h-full w-full object-cover rounded-none"
          />
          {hovered && (
            <CardHeader className="absolute w-full h-48 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:opacity-100 transition-opacity duration-300">
              <CardTitle className="absolute bottom-4 left-4 text-white text-lg font-medium">
                {project.title}
              </CardTitle>
            </CardHeader>
          )}
        </div>

        <CardContent className="px-4 py-1 mt-1">
          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Eye size={18}/>
              <span>{project.stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart size={18} className="text-primary"/>
              <span>{project.stats.likes.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProjectCard;
