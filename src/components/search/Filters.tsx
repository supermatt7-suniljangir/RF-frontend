"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, SortAsc } from "lucide-react"; // Icons
import { useRouter, useSearchParams } from "next/navigation";

export default function SortAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const filter = params.get("filter");
  const sort = params.get("sort");

  const handleSortChange = (sortOption: string) => {
    if (params.get("sort") === sortOption) {
      params.delete("sort"); // Remove sort if clicked again
    } else {
      params.set("sort", sortOption);
    }
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (filterOption: string) => {
    if (params.get("filter") === filterOption) {
      params.delete("filter"); // Remove filter if clicked again
    } else {
      params.set("filter", filterOption);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Sort Dropdown with Icon */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="flex items-center gap-2 capitalize">
            <SortAsc className="w-4 h-4" /> {sort || "Sort By"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSortChange("popular")}>
            Popular
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("newest")}>
            Newest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Dropdown with Icon */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="flex items-center gap-2 capitalize">
            <Filter className="w-4 h-4" /> {filter || "Filters"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleFilterChange("free")}>
            Free
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("paid")}>
            Paid
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFilterChange("premium")}>
            Premium
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
