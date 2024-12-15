import ProjectCard from "@/components/common/ProjectCard";
import { ProjectMini } from "@/types/project";

const HomePage: React.FC = async () => {
  // const projects: ProjectMini[] = await getProjects();
  // if (!projects) throw new Error("Failed to fetch projects");
  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {/* {projects?.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))} */}
    </div>
  );
};

export default HomePage;
