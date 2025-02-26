import React, { memo } from 'react';
import { Delete } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    inputTag: string;
    setInputTag: (value: string) => void;
    onAddTag: (tag: string) => void;
    onRemoveTag: (index: number) => void;
}

const TagInput: React.FC<TagInputProps> = ({
    tags,
    inputTag,
    setInputTag,
    onAddTag,
    onRemoveTag
}) => {
    return (
        <div className="flex flex-wrap py-2 items-center w-fit gap-2">
            {tags?.map((tag, index) => (
                <div
                    key={index}
                    className="h-fit px-2 py-1 box-border bg-muted text-sm flex items-center gap-2"
                >
                    <span>{tag}</span>
                    <button type="button" onClick={() => onRemoveTag(index)}>
                        <Delete className="w-4 h-4" />
                    </button>
                </div>
            ))}

            <input
                type="text"
                placeholder="Add a Tag"
                className="border border-primary text-sm text-muted-foreground font-medium bg-transparent p-1"
                maxLength={20}
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAddTag((e.target as HTMLInputElement).value)}
            />
        </div>
    );
};

export default memo(TagInput);