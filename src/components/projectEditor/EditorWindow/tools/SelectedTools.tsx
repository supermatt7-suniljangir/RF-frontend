// File 1: SelectedToolsList.jsx
"use client";
import { Button } from '@/components/ui/button';
import { Delete } from 'lucide-react';
import React, { memo } from 'react';

const SelectedToolsList = ({ selectedTools, onRemove }) => {
    if (!selectedTools?.length) return null;

    return (
        <div className="flex flex-wrap py-2 items-center w-fit gap-2">
            {selectedTools.map((tool, index) => (
                <Button
                    variant="ghost"
                    key={index}
                    className="h-fit px-2 py-1 box-border text-muted-foreground bg-muted text-sm flex items-center gap-2 rounded-none"
                >
                    <span>{tool.name}</span>
                    <button type="button" onClick={() => onRemove(tool._id)}>
                        <Delete className="w-4 h-4" />
                    </button>
                </Button>
            ))}
        </div>
    );
}


export default memo(SelectedToolsList);