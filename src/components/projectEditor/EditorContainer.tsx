"use client";
import React, { useEffect, useRef } from 'react'
import BuildComponents from './BuildComponents'
import ProjectMedia from './ProjectMedia'
import ProjectMetadata from './ProjectMetadata'
import { useEditor } from '@/contexts/ProjectEditorContext'

const EditorContainer = () => {
    const { uiState: { isDescOpen }, media, updateEditorStage, updateUIState, mediaContainerRef } = useEditor();
    useEffect(() => {
        if (media.length > 0) {
            updateEditorStage(1);
            updateUIState({ isDescOpen: true });
        }
        else {
            updateEditorStage(0);
            updateUIState({ isDescOpen: false });
        }
    }, [media]);


    return (
        <div className='w-full flex'>
            <div className='w-1/5 sticky top-0 left-0 h-screen'>
                <BuildComponents />
            </div>
            <div className='w-4/5 flex flex-col p-4'>
                <div ref={mediaContainerRef} className='flex flex-col'>
                    {!isDescOpen && !media.length && (
                        <div className='text-muted-foreground font-medium text-center pt-20'>
                            Add Media to get started
                        </div>
                    )}
                    <ProjectMedia />
                    <ProjectMetadata />
                </div>
            </div>
        </div>
    )
}

export default EditorContainer