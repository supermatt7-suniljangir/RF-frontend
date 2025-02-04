"use client";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useEditor } from '@/contexts/ProjectEditorContext';
import { Card } from '@/components/ui/card';
import ProjectThumbnail from './ProjectThumbnail';
import ProjectWindowSidebar from './ProjectWindowSidebar';
const ProjectWindow: React.FC = () => {
    const {
        editorStage,
        updateEditorStage,
    } = useEditor();
    const onClose = () => updateEditorStage(1);
    const isOpen = editorStage === 2;
    return (
        <div className='w-full'>
            <Dialog open={isOpen} onOpenChange={onClose} >
                <DialogContent className="w-full h-[90vh] rounded-none p-4">
                    <div className="flex gap-2 flex-col overflow-scroll h-auto relative">
                        <DialogTitle className='text-center hidden'>
                            {/* shut the dialogue warning off by keeping it, but hidden, removing it throws an error */}
                        </DialogTitle>
                        {/* primary layout for the modal */}
                        <Card className='h-5/6 w-full flex lg:flex-row flex-col mt-6 rounded-none overflow-scroll'>
                            {/* left side */}
                            <ProjectThumbnail />
                            {/* right side */}
                            <ProjectWindowSidebar />
                        </Card>
                        {/* bottom fixed buttons */}
                        <div className='w-full flex justify-end gap-4 fixed bottom-0 left-0 bg-background p-4'>
                            <Button variant='ghost' className='rounded-none w-24' onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant='ghost' className='bg-muted text-muted-foreground rounded-none w-24'>
                                Save Draft
                            </Button>
                            <Button variant="secondary" className='rounded-none w-24' onClick={onClose}>
                                Publish
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectWindow;
