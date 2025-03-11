// components/ProjectHeader/index.tsx
import Collaborators from "./Collaborators";
import CreatorMiniInfo from "./CreatorMiniInfo";
import InteractionButtons from "./InteractionButtons";
import type {ProjectType} from "@/types/project";

interface ProjectHeaderProps {
    project: ProjectType;
}

const ProjectHeader = ({project}: ProjectHeaderProps) => {
    return (
        <div className="w-full px-4">
            <div className="my-4 md:m-0">
                <h1 className="text-2xl font-bold">{project.title}</h1>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    {project.collaborators?.length > 0 ? <div>

                            <Collaborators collaborators={project.collaborators} creator={project.creator}/>
                        </div>
                        :
                        <CreatorMiniInfo creator={project.creator}/>
                    }
                </div>
                <div className="flex items-center gap-4">
                    <InteractionButtons project={project} key={project._id}/>
                </div>
            </div>
        </div>
    );
};
export default ProjectHeader;
