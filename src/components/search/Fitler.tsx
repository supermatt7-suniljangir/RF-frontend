"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const type = params.get("type") as "project" | "user";
  const filter = params.get("filter");

  const handleFilterChange = (filterOption: string, checked: boolean) => {
    if (checked) {
      params.set("filter", filterOption);
    } else {
      params.delete("filter");
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      {type === "user" ? (
        <div className="flex items-center gap-2">
          <Checkbox
            id="isAvailableForHire"
            checked={filter === "isAvailableForHire"}
            onCheckedChange={(checked: boolean) =>
              handleFilterChange("isAvailableForHire", checked)
            }
          />
          <label
            htmlFor="isAvailableForHire"
            className="text-base font-semibold"
          >
            Available for Hire
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={filter === "featured"}
            onCheckedChange={(checked: boolean) =>
              handleFilterChange("featured", checked)
            }
          />
          <label htmlFor="featured" className="text-base font-semibold">
            Featured
          </label>
        </div>
      )}
    </div>
  );
}
