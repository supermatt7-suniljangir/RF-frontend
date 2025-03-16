"use client";
import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";

import { toast } from "@/hooks/use-toast";
import TagInput from "./TagInput";
import SuggestedTags from "./SuggestedTags";
import { useProjectContext } from "@/contexts/ProjectContext";

const ProjectTags = () => {
  const [inputTag, setInputTag] = useState<string>("");
  const { tags, updateTags } = useProjectContext();
  const regex = /^[a-zA-Z0-9. ]+$/;

  const handleAddTag = useCallback(
    (tag: string) => {
      if (tags.includes(tag)) {
        toast({
          variant: "destructive",
          title: "Tag already added",
          duration: 4000,
        });
        return;
      }
      if (tags.length >= 10) {
        toast({
          variant: "destructive",
          title: "You can't add more than 10 tags",
          duration: 4000,
        });
        return;
      }
      if (!regex.test(tag)) {
        toast({
          variant: "destructive",
          title: "Invalid tag",
          description: "Tag should not contain special characters",
          duration: 4000,
        });
        return;
      }
      if (tag) {
        updateTags([...tags, tag]);
        setInputTag("");
      }
    },
    [tags, updateTags],
  );

  const handleSuggestedTags = useCallback(
    (suggestedTag: string) => {
      if (tags.length >= 10) {
        toast({
          variant: "destructive",
          title: "You can't add more than 10 tags",
          duration: 4000,
        });
        return;
      }
      if (tags.includes(suggestedTag)) return;
      updateTags([...tags, suggestedTag]);
    },
    [tags, updateTags],
  );

  const removeTag = useCallback(
    (index: number) => {
      updateTags(tags.filter((tag, i) => i !== index));
    },
    [tags, updateTags],
  );

  return (
    <Card className="flex flex-wrap items-center w-full rounded-none p-4 border-none shadow-none">
      <h2 className="font-semibold w-full">Tags (for better search results)</h2>

      <TagInput
        tags={tags}
        inputTag={inputTag}
        setInputTag={setInputTag}
        onAddTag={handleAddTag}
        onRemoveTag={removeTag}
      />

      <SuggestedTags tags={tags} onSelectTag={handleSuggestedTags} />
    </Card>
  );
};

export default ProjectTags;
