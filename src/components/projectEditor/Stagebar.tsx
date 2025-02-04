"use client";
import React from "react";
import { useEditor } from "@/contexts/ProjectEditorContext";


const ProgressBar = () => {
    // Import editorStage from your hook
    const { editorStage } = useEditor();

    // Calculate the progress percentage based on the stage (33% per stage)
    const totalStages = 2;
    const progressPercentage = (editorStage / totalStages) * 100;

    return (
        <div className="h-28 w-2 bg-muted rounded-full absolute right-2 top-8 overflow-visible">
            <div
                className="absolute top-0 left-0 w-full bg-secondary transition-all"
                style={{ height: `${progressPercentage}%` }}
            >
            </div>
            <div
                className="w-3 h-3 bg-secondary absolute transform left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ top: `${progressPercentage - 2}%` }}></div>
        </div >
    );
};

export default ProgressBar;
