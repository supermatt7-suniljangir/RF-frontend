"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEditor } from '@/contexts/ProjectEditorContext';
import useTools from '@/features/tools/useTools';
import { cn } from '@/lib/utils';
import { Itool } from '@/types/others';
import { Delete } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const ProjectTools = () => {
    const { tools: selectedTools, updateTools } = useEditor();
    const { tools: availableTools } = useTools();

    const handleSelectTag = (tool: Itool) => {
        if (selectedTools.some((selectedTool) => selectedTool.name === tool.name)) return;
        updateTools([...selectedTools, tool]);
    }

    const removeTool = (_id: string) => {
        updateTools(selectedTools.filter((tag) => tag._id !== _id));
    }
    return (
        <Card className="flex flex-wrap items-center w-full rounded-none  p-4 border-none shadow-none">
            <h2 className="font-semibold w-full">
                Tools Used
            </h2>
            <CardContent className='p-0'>
                {selectedTools?.length > 0 && (
                    <div className="flex flex-wrap py-2 items-center w-fit gap-2">
                        {selectedTools.map((tool, index) => (
                            <Button
                                variant='ghost'
                                key={index}
                                className="h-fit px-2 py-1 box-border text-muted-foreground bg-muted text-sm flex items-center gap-2 rounded-none"
                            >
                                <span>{tool.name}</span>
                                <button type="button" onClick={() => removeTool(tool._id)}>
                                    <Delete className="w-4 h-4" />
                                </button>
                            </Button>
                        ))}
                    </div>)}


                <div className='flex flex-wrap gap-2 justify-start items-center mt-2'>
                    <p className='text-sm'>  Select Tools:</p>
                    {availableTools.map((tool, index) => {
                        const isSelected = selectedTools.some((selectedTool) => selectedTool._id === tool._id);
                        return (
                            <Button onClick={() => handleSelectTag(tool)} variant='ghost' key={index} className={cn("flex border rounded-none px-2 py-1 h-fit", isSelected && "bg-muted text-muted-foreground")}>
                                <Image src={tool.icon} alt={tool.name} width={20} height={20} />
                                <span className="text-sm">{tool.name}</span>
                            </Button>
                        );
                    })}

                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectTools