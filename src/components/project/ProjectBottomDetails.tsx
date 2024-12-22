import { Eye, MessageCircleMore } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LikeButton from './LikeButton';
import { cn } from '@/lib/utils';
import { ProjectType } from '@/types/project';
import { formatDate } from '@/lib/formateDate';
import { ThumbsUp } from 'lucide-react';

interface CasinoMetricsProps {
  project: ProjectType
}

const ProjectBottomDetails: React.FC<CasinoMetricsProps> = ({ project }) => {
  const { title, stats: { likes, views, comments }, publishedAt } = project;
  return (
    <div className="md:w-2/3 w-full h-full">
      <Card className={cn("rounded-none border-none h-full shadow-none")}>
        <CardContent className="pt-6 rounded-none border-none h-full shadow-none">
          <div className="flex flex-col items-center space-y-6 h-full">
            <LikeButton />
            <h1 className="text-2xl font-bold">
              {title || "that's not supposed to happen"}
            </h1>

            <div className="flex items-center space-x-6 text-base text-muted-foreground">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-5 h-5" />
                <span>{likes}</span>
              </div>

              <div className="flex items-center space-x-1">
                <Eye className="w-5 h-5" />
                <span>{views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircleMore className='w-5 h-5' />
                <span>{comments}</span>
              </div>
            </div>

            <p className="text-muted-foreground text-sm">
              Published: {formatDate(publishedAt)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectBottomDetails;