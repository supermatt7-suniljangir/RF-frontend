import { ProjectType } from "@/types/project";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

interface ProjectDescriptionProps {
  project: ProjectType;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <div className="w-full ">
      <Card className="flex w-full rounded-none p-4 md:p-8">
        <CardContent className="flex-col space-y-2 px-0">
          <h2 className="text-2xl font-semibold">{project.title}</h2>
          <p className="">{project.shortDescription}</p>
          <p className="text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDescription;
