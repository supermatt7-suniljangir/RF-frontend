import React from "react";

import ProjectInfo from "@/components/project/Project";

const Project = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProjectInfo id={id} />;
};

export default Project;
