"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
const tags: string[] = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "one",
  "two",
  "three",
  "four",
];
const SearchTags = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [selectedTag, setSelectedTag] = useState<string | null>(
    params.get("tag")
  );

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    // Update the URL with the selected tag
    if (params.get("tag") === tag) {
      setSelectedTag(null);
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className=" flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => (
        <Button
          key={index}
          onClick={() => handleTagClick(tag)}
          className={`px-3 h-auto py-1 capitalize w-auto text-base font-medium ${
            selectedTag === tag ? "bg-primary" : "bg-secondary"
          }`}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
};

export default SearchTags;
