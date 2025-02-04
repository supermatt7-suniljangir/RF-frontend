"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { categories } from "@/lib/categories";



export default function CategorySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      if (type !== "user") {
        params.set("category", cat);
      }
    }
    router.push(`?${params.toString()}`);
  };

  if (type === "user") return null;

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedCategory}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          {categories.map((category, index) => (
            <SelectItem value={category} key={index}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}