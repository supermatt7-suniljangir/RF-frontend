import { Eye, MessageCircleMore } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "./LikeButton";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/project";
import { formatDate } from "@/lib/formateDate";
import { ThumbsUp } from "lucide-react";
import Image from "next/image";

interface CasinoMetricsProps {
  project: ProjectType;
}

const ProjectBottomDetails: React.FC<CasinoMetricsProps> = ({ project }) => {
  const {
    title,
    stats: { likes, views, comments },
    publishedAt,
  } = project;
  return (
    <div className="md:w-2/3 w-full h-full">
      <div className="w-full flex flex-col">
        <Card
          className={cn(
            "rounded-none border-none h-full shadow-none w-auto py-0",
          )}
        >
          <CardContent className="pt-6 pb-0 rounded-none border-none h-full shadow-none">
            <div className="flex flex-col items-center h-full">
              <LikeButton
                projectId={project._id}
                size="large"
                initialLikes={project.stats.likes || 0}
              />

              <div className="flex items-center space-x-6 text-sm text-muted-foreground my-1">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>
                    {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircleMore className="w-4 h-4" />
                  <span>{comments}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm text-center md:text-start">
                Published:
                {formatDate(publishedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* tools and creators */}
        {project?.tools.length > 0 && (
          <div className="space-y-2 relative py-4">
            <h4 className="text-balance font-semibold text-center">Tools</h4>
            <div className=" flex gap-2 justify-center flex-wrap">
              {project.tools?.map((tool, index) => (
                <Card
                  key={index}
                  className="text-muted-foreground p-0 rounded-none"
                >
                  <CardContent className="flex gap-2 px-2 py-1 justify-between items-center">
                    <p className="font-medium"> {tool.name} </p>
                    <div className="w-8 h-8 relative">
                      <Image src={tool.icon} alt={tool.name} fill />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBottomDetails;
