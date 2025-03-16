"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { memo } from "react";

const ToolSelector = ({ availableTools, selectedTools, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-start items-center mt-2">
      <p className="text-sm">Select Tools:</p>
      {availableTools?.map((tool, index) => {
        const isSelected = selectedTools.some(
          (selectedTool) => selectedTool._id === tool._id,
        );
        return (
          <Button
            onClick={() => onSelect(tool)}
            variant="ghost"
            key={index}
            className={cn(
              "flex border rounded-none px-2 py-1 h-fit",
              isSelected && "bg-muted text-muted-foreground",
            )}
          >
            <Image src={tool.icon} alt={tool.name} width={20} height={20} />
            <span className="text-sm">{tool.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default memo(ToolSelector);
