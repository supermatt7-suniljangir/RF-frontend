"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import CategorySelector from "./Categories";
import { useEffect } from "react";

// Define form input types
interface SearchFormInputs {
  query: string;
  type: string; // "project" or "user"
}

export default function SearchBar() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const searchQuery = params.get("query");
  const searchType = params.get("type") || "project"; // Default to project search

  const { register, handleSubmit, setValue, setError, formState, reset } =
    useForm<SearchFormInputs>({
      defaultValues: { query: searchQuery as string, type: searchType },
    });

  useEffect(() => {
    reset({ query: searchQuery, type: searchType });
  }, [searchQuery, searchType, reset]);

  const { errors } = formState;

  const router = useRouter();

  // Form submit handler
  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    const query = data.query.trim();
    const type = data.type;
    if (!query) {
      setError("query", { message: "Search query cannot be empty" });
      return;
    }

    params.set("query", query);
    params.set("type", type);
    params.delete("page");
    params.delete("filter");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("tag");
    params.delete("category");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col
     sm:flex-row sm:items-center md:justify-center items-center gap-4 w-full"
    >
      <div className="w-full sm:w-[120px]">
        <CategorySelector />
      </div>
      <div className="relative w-full sm:w-[400px] md:w-[500px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          {...register("query")}
          placeholder="Search inspiration"
          className={`pl-8 ${errors.query ? "ring-2 ring-red-500" : "focus:ring-2"
            } bg-muted text-muted-foreground focus:border-primary placeholder:text-muted-foreground`}
        />
        {errors.query && (
          <p className="text-red-500 text-sm mt-1">{errors.query.message}</p>
        )}
      </div>

      {/* Search Type Select */}
      <div className="w-full sm:w-[100px]">
        <Select
          defaultValue={searchType}
          onValueChange={(value) => setValue("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="sm:ml-4 mt-4 sm:mt-0">
        Search
      </Button>
    </form>
  );
}
