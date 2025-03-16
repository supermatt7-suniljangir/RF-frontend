"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ProjectTags from "./tags/ProjectTags";
import ProjectTools from "./tools/ProjectTools";
import ProjectCategory from "./category/ProjectCategory";
import ProjectCollaborators from "./collaborators/ProjectCollaborators";

const ProjectWindowSidebar = () => {
  return (
    <Card className="lg:w-3/5 flex-grow w-full border-l shadow-none h-fit min-h-full rounded-none p-0">
      <CardContent className="p-4">
        <ProjectTags />
        <ProjectTools />
        <ProjectCategory />
        <ProjectCollaborators />
      </CardContent>
    </Card>
  );
};

export default ProjectWindowSidebar;
