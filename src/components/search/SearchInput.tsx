"use client";

import React, { memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface SearchFormInputs {
  query: string;
  type: string;
}

interface SearchInputs {
  errors?: FieldErrors<SearchFormInputs>;
  register?: UseFormRegister<SearchFormInputs>;
}

const SearchInput: React.FC<SearchInputs> = ({ errors, register }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Local state for standalone mode
  const [localQuery, setLocalQuery] = React.useState("");

  // Common handler for redirection
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return; // Prevent empty queries
    router.push(`/search?query=${trimmedQuery}&type=project`);
  };

  if (pathname === "/search") {
    // Case 1: Inside `/search`, using `register`
    return (
      <div className="relative w-full sm:w-[400px] md:w-[500px] flex items-center">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          {...register("query")}
          placeholder="Search inspiration"
          className={`pl-8 ${errors?.query ? "ring-2 ring-red-500" : "focus:ring-2"
            } bg-muted text-muted-foreground focus:border-primary placeholder:text-muted-foreground`}
        />
        {errors?.query && (
          <p className="text-red-500 text-sm mt-1">{errors.query.message}</p>
        )}
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </div>
    );
  }

  // Case 2: Standalone mode (homepage)
  return (
    <div className="relative w-full mx-auto sm:w-[400px] md:w-[500px] flex items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(localQuery);
        }}
        className="flex w-full items-center"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search inspiration"
            className="pl-8 focus:ring-2 bg-muted text-muted-foreground focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
        <Button type="submit" className="ml-2">
          Search
        </Button>
      </form>
    </div>
  );
};

export default memo(SearchInput);
