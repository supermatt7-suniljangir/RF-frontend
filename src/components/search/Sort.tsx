// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown, Filter, SortAsc } from "lucide-react"; // Icons
// import { useRouter, useSearchParams } from "next/navigation";

// export default function SortAndFilter() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const params = new URLSearchParams(searchParams.toString());
//   const sortBy = params.get("sortBy");
//   const sortOrder = params.get("sortOrder") as "asc" | "desc";
//   const category = params.get("category");
//   const query = params.get("query");
//   const tag = params.get("tag");
//   const type = params.get("type") as "project" | "user";


//   const handleSortChange = (sortOption: string) => {
//     if (params.get("sort") === sortOption) {
//       params.delete("sort"); // Remove sort if clicked again
//     } else {
//       params.set("sort", sortOption);
//     }
//     router.push(`?${params.toString()}`);
//   };

//   const handleFilterChange = (filterOption: string) => {
//     if (params.get("filter") === filterOption) {
//       params.delete("filter"); // Remove filter if clicked again
//     } else {
//       params.set("filter", filterOption);
//     }
//     router.push(`?${params.toString()}`);
//   };

//   return (
//     <div className="flex items-center gap-4">
//       {/* Sort Dropdown with Icon */}
//       <DropdownMenu>
//         <DropdownMenuTrigger>
//           <Button variant="outline" className="flex items-center gap-2 capitalize">
//             <SortAsc className="w-4 h-4" /> {sort || "Sort By"}
//             <ChevronDown className="w-4 h-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent>
//           <DropdownMenuItem onClick={() => handleSortChange("popular")}>
//             Popular
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={() => handleSortChange("newest")}>
//             Newest
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SortAsc } from "lucide-react"; // Icons
import { useRouter, useSearchParams } from "next/navigation";

export default function Sort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const sortBy = params.get("sortBy");
  const sortOrder = params.get("sortOrder") as "asc" | "desc";
  const type = params.get("type") as "project" | "user";  // Can be "user" or "project"
  if (type === "user") return null;


  const projectSortMapping = {
    likes: "stats.likes",
    views: "stats.views",
    createdAt: "createdAt",
    title: "title",
  };


  // Function to handle the sort change
  const handleSortChange = (sortOption: string) => {
    params.set("sortBy", sortOption);  // Update sortBy query param
    router.push(`?${params.toString()}`);  // Trigger URL update to re-fetch with new sort
  };

  // Function to handle the sort order (ascending or descending)
  const handleSortOrderChange = (order: "asc" | "desc") => {
    params.set("sortOrder", order);  // Update sortOrder query param
    router.push(`?${params.toString()}`);  // Trigger URL update
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="flex items-center gap-2 capitalize">
            <SortAsc className="w-4 h-4" /> {sortBy || "Sort By"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(projectSortMapping).map((sortOption) => (
            <DropdownMenuItem className="capitalize" key={sortOption}
              onClick={() => handleSortChange(sortOption)}>
              {sortOption === "createdAt" ? "Date" : sortOption}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="flex items-center gap-2 capitalize">
            {sortOrder === "asc" ? "Ascending" : "Descending"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSortOrderChange("asc")}>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortOrderChange("desc")}>
            Dsc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
