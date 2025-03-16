"use client";
import { Card, CardContent } from "@/components/ui/card";
import useTools from "@/features/tools/useTools";
import React, { useCallback } from "react";

// Import components from their respective files
import ToolSelector from "./ToolSelector";
import SelectedTools from "./SelectedTools";
import { useProjectContext } from "@/contexts/ProjectContext";

const ProjectTools = () => {
  const { tools: selectedTools, updateTools } = useProjectContext();
  const { tools: availableTools, error } = useTools();

  const handleSelectTool = useCallback(
    (tool) => {
      if (selectedTools.some((selectedTool) => selectedTool.name === tool.name))
        return;
      updateTools([...selectedTools, tool]);
    },
    [selectedTools, updateTools],
  );

  const removeTool = useCallback(
    (_id) => {
      updateTools(selectedTools.filter((tool) => tool._id !== _id));
    },
    [selectedTools, updateTools],
  );

  if (error) {
    return (
      <Card className="flex flex-wrap items-center w-full rounded-none p-4 border-none shadow-none">
        <h2 className="font-semibold w-full">Tools Used</h2>
        <CardContent className="p-0">
          <div className="text-red-500">
            <p>Error fetching tools: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-wrap items-center w-full rounded-none p-4 border-none shadow-none">
      <h2 className="font-semibold w-full">Tools Used</h2>
      <CardContent className="p-0">
        <SelectedTools selectedTools={selectedTools} onRemove={removeTool} />

        <ToolSelector
          availableTools={availableTools}
          selectedTools={selectedTools}
          onSelect={handleSelectTool}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectTools;
