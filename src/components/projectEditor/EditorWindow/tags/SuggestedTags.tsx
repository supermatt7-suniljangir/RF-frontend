import React, { memo } from "react";
import { Button } from "@/components/ui/button";

// These could be moved to a constants file if needed elsewhere
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

interface SuggestedTagsProps {
  tags: string[];
  onSelectTag: (tag: string) => void;
}

const SuggestedTags: React.FC<SuggestedTagsProps> = ({ tags, onSelectTag }) => {
  return (
    <div className="my-2">
      <p className="flex flex-wrap items-center gap-2 text-sm">
        Suggested Tags:{" "}
        {suggestedTags.map((tag) => (
          <Button
            variant="ghost"
            key={tag}
            className={`px-2 py-1 rounded-none border h-fit ${
              tags.includes(tag)
                ? "bg-muted cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </p>
    </div>
  );
};

export default memo(SuggestedTags);
