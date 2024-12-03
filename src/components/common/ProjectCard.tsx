import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Project2 from "@/media/project-2.jpg";
import Link from "next/link";
interface ProjectCardProps {
  project: {
    title: string;
    imageUrl: string;
    views: number;
    likes: number;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return ( 
    <Card className="w-full">
        <Link href={`project/dfd`}>
      <div className="relative h-56 sm:h-64 md:h-60 overflow-hidden  rounded-t-md">
        <Image
          src={Project2}
          alt={project.title}
          fill
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Eye size={18} />
            <span>{project.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart size={18} className="text-primary" />
            <span>{project.likes.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      </Link>
    </Card>
  );
};

export default ProjectCard;
