"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react"; // Icon
import { useRouter, useSearchParams } from "next/navigation";

const categories: string[] = ["thing", "shit", "dick"];

export default function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const params = new URLSearchParams(searchParams.toString());
  const category = params.get("category");
  const handleCategoryChange = (category: string) => {
    if (selectedCategory === category) {
      params.delete("category"); // Remove category if selected again
    } else {
      params.set("category", category);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Category Dropdown with Icon */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="flex items-center gap-2 capitalize">
            {category || "Categories"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {categories.map((category, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
