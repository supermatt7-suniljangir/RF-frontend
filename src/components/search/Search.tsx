"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import CategorySelector from "./Categories";
import { useCallback, useEffect } from "react";
import SearchInput from "./SearchInput";

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

  // Form submit handler with useCallback
  const onSubmit = useCallback<SubmitHandler<SearchFormInputs>>(
    (data) => {
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
    },
    [params, router, setError],
  );
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col
     sm:flex-row sm:items-center md:justify-center items-center gap-4 w-full"
    >
      <div className="w-full sm:w-[120px]">
        <CategorySelector />
      </div>

      <SearchInput errors={errors} register={register} />
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
    </form>
  );
}
