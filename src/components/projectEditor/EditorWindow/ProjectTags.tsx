"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditor } from '@/contexts/ProjectEditorContext';
import { toast } from '@/hooks/use-toast';
import { Delete } from 'lucide-react';
import React, { useState } from 'react';

const categories = [
    "UI/UX",
    "Web Design",
    "Branding",
    "Illustration",
    "Graphic Design",
    "Product Design",
    "Fashion",
    "Icon Design",
    "Photography",
    "Logo/Banner",
];
const suggestedTags = [
    "User Interface",
    "Figma Design",
    "Photography",
    "Icon Design",
    "Illustration",
    "Logo Design",
    "Branding",
    "Product Design",
    "Fashion",
];


const ProjectTags = () => {
    const [inputTag, setInputTag] = useState<string>("");
    const regex = /^[a-zA-Z0-9. ]+$/;
    const { tags, updateTags } = useEditor();
    function handleAddTag(tag: string) {
        if (tags.includes(tag)) {
            toast({
                variant: "destructive",
                title: "Tag already added",
                duration: 4000,
            })
            return;
        }
        if (tags.length >= 10) {
            toast({
                variant: "destructive",
                title: "You can't add more than 10 tags",
                duration: 4000,
            })
            return;
        }
        if (!regex.test(tag)) {
            toast({
                variant: "destructive",
                title: "Invalid tag",
                description: "Tag should not contain special characters",
                duration: 4000,
            })
            return;
        }
        if (tag) {
            updateTags([...tags, tag]);
            setInputTag("");
        }
    }

    function handleSuggestedTags(suggestedTag: string) {
        if (tags.length >= 10) {
            toast({
                variant: "destructive",
                title: "You can't add more than 10 tags",
                duration: 4000,
            })
            return;
        }
        if (tags.includes(suggestedTag)) return;
        updateTags([...tags, suggestedTag]);
    }

    function removeTag(index: number) {
        updateTags(tags.filter((tag, i) => i !== index));
    }
    return (

        <Card className='flex flex-wrap items-center w-full rounded-none p-4 border-none shadow-none'>
            <h2 className="font-semibold w-full">
                Tags (for better search results)
            </h2>
            <div className="flex flex-wrap py-2 items-center w-fit gap-2 ">
                {tags?.map((tag, index) => (
                    <div
                        key={index}
                        className="h-fit px-2 py-1 box-border bg-muted text-sm flex items-center gap-2 "
                    >
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(index)}>
                            <Delete className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <input
                    type="text"
                    placeholder="Add a Tag"
                    className="border border-primary text-sm text-muted-foreground font-medium bg-transparent p-1 "
                    maxLength={20}
                    value={inputTag}
                    onChange={(e) => setInputTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag((e.target as HTMLInputElement).value)}
                />
            </div>

            <div className="my-2">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                    Suggested Tags:{" "}
                    {suggestedTags.map((tag) => (
                        <Button
                            variant='ghost'
                            key={tag}
                            className={`px-2 py-1  rounded-none border h-fit ${tags.includes(tag)
                                ? "bg-muted cursor-not-allowed"
                                : "cursor-pointer"
                                }`}
                            onClick={() => handleSuggestedTags(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </p>
            </div>
        </Card>

    );
}

export default ProjectTags