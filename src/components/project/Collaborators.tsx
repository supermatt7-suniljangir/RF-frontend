"use client";
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, SquareStack } from "lucide-react"
import { MiniUser } from '@/types/user'
import CreatorMiniInfo from './CreatorMiniInfo';

interface CollaboratorsProps {
    collaborators: MiniUser[],
    creator: MiniUser,
}

const Collaborators: React.FC<CollaboratorsProps> = ({ collaborators, creator }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = (open: boolean) => setIsOpen(open);

    return (
        <Popover open={isOpen} onOpenChange={handleOpen}>
            <PopoverTrigger
                className="inline-flex items-center gap-2 p-2"
                onMouseEnter={() => handleOpen(true)}
                onMouseLeave={() => handleOpen(false)}
            >
                <SquareStack />
                <span>Multiple Owners</span>
                <ChevronDown className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent
                className="w-auto -mt-1 flex flex-col gap-4"
                onMouseEnter={() => handleOpen(true)}
                onMouseLeave={() => handleOpen(false)}
            >
                <CreatorMiniInfo creator={creator} styles="px-4 py-2 bg-muted text-muted-foreground" />
                {collaborators.map((collab, idx) => (
                    <CreatorMiniInfo key={collab._id || idx} creator={collab} styles="px-4 py-2 hover:bg-muted hover:text-muted-foreground" />
                ))}
            </PopoverContent>
        </Popover>
    );
};
export default React.memo(Collaborators);
