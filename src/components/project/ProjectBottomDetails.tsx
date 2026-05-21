import { Eye, MessageCircleMore } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LikeButton from "./LikeButton";
import { cn } from "@/lib/utils";
import { ProjectType } from "@/types/project";
import { formatDate } from "@/lib/formateDate";
import Image from "next/image";

interface CasinoMetricsProps {
  project: ProjectType;
}

const ProjectBottomDetails: React.FC<CasinoMetricsProps> = ({ project }) => {
  const {
    stats: { views, comments, likes },
    publishedAt,
  } = project;
  return (
    <div className="h-full w-full md:w-2/3">
      <div className="flex w-full flex-col">
        <Card
          className={cn(
            "h-full w-auto rounded-none border-none py-0 shadow-none",
          )}
        >
          <CardContent className="h-full rounded-none border-none pb-0 pt-6 shadow-none">
            <div className="flex h-full flex-col items-center">
              <LikeButton
                projectId={project._id}
                size="large"
                initialLikes={likes || 0}
              />

              <div className="my-1 flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>
                    {views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircleMore className="h-4 w-4" />
                  <span>{comments}</span>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground md:text-start">
                Published:
                {formatDate(publishedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* tools and creators */}
        {project?.tools.length > 0 && (
          <div className="relative space-y-2 py-4">
            <h4 className="text-balance text-center font-semibold">Tools</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {project.tools?.map((tool, index) => (
                <Card
                  key={index}
                  className="rounded-none p-0 text-muted-foreground"
                >
                  <CardContent className="flex items-center justify-between gap-2 px-2 py-1">
                    <p className="font-medium"> {tool.name} </p>
                    <div className="relative h-8 w-8">
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
