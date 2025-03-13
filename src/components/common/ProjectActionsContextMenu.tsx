'use client';

import {MoreVertical, Pencil, Trash2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {cn} from "@/lib/utils";
import {useCallback, useState} from "react";
import Modal from "@/components/common/Modal";
import {useProjectUpload} from "@/features/project/useProjectUpload";

const ProjectActionsContextMenu = ({projectId}: { projectId: string }) => {
    const {deleteExisting, loading} = useProjectUpload();
    const [openDeleteWindow, setOpenDeleteWindow] = useState<boolean>(false);
    const handleDeleteProject = useCallback(async () => {
        await deleteExisting(projectId);
        setOpenDeleteWindow(false);
    }, [projectId, deleteExisting])

    return (
        <>
            <Popover>
                {/* Trigger */}
                <PopoverTrigger asChild>
                    <Button variant="ghost" className={cn(`p-0`)} size="icon">
                        <MoreVertical/>
                    </Button>
                </PopoverTrigger>

                {/* Menu */}
                <PopoverContent className="w-40 p-0">
                    <button
                        className="w-full text-left px-4 py-2 flex  items-center gap-2 hover:bg-secondary hover:text-secondary-foreground"
                        onClick={() => console.log('Action 1')}
                    >
                        <Pencil size={12}/> Edit
                    </button>
                    <button onClick={() => setOpenDeleteWindow(true)}
                            className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-secondary hover:text-secondary-foreground"
                    >
                        <Trash2 size={12}/> Delete
                    </button>
                </PopoverContent>

            </Popover>
            {openDeleteWindow &&
                <Modal title={`Delete The Project?`} isOpen={openDeleteWindow}
                       customContainerStyles={`w-full md:w-1/3 text-red-500`}
                       setIsOpen={setOpenDeleteWindow}
                       loading={loading}
                       handler={handleDeleteProject}>This is a Permanent Action and cannot be undone</Modal>}
        </>
    );
};

export default ProjectActionsContextMenu;
