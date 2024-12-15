"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const tags: string[] = [
  "Photography",
  "Minimal",
  "Art",
  "Education",
  "Entertainment",
  "Health",
  "Lifestyle",
  "Technology",
  "Web Design",
  "Fashion",
  "Food",
  "Travel",
];

const SearchTags = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const tag = params.get("tag");
  const [selectedTag, setSelectedTag] = useState<string | null>(
    params.get("tag") || ""
  );
useEffect(() => {
    setSelectedTag(params.get("tag") || "");
  }
, [tag]);
  const handleTagClick = (tag: string) => {
    // Clear all params when a tag is selected
    params.delete("query");
    params.delete("page");
    params.delete("filter"); // Example: Remove other filters
    params.delete("sortBy");  // Example: Remove sorting
    params.delete("sortOrder");  // Example: Remove sorting
    params.delete("type");  // Example: Remove sorting
    params.delete("category");  // Example: Remove sorting

    if (selectedTag === tag) {
      setSelectedTag(null);
      params.delete("tag");
    } else {
      setSelectedTag(tag);
      params.set("tag", tag);
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => (
        <Button
          key={index}
          onClick={() => handleTagClick(tag)}
          className={`px-3 h-auto py-1 capitalize w-auto text-base rounded-none font-medium ${selectedTag === tag ? "bg-primary" : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default SearchTags;
