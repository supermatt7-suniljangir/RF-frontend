"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

// Define form input types
interface SearchFormInputs {
  query: string;
}

export default function SearchBar() {
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams?.toString() || "");
  const searchQuery = params.get("query");
  const { register, handleSubmit, setError, formState } =
    useForm<SearchFormInputs>({
      defaultValues: { query: searchQuery as string },
    });
  const { errors } = formState;

  const router = useRouter();

  // Form submit handler with proper type
  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    const query = data.query.trim();
    if (!query) {
      setError("query", { message: "Search query cannot be empty" });
      return;
    }
    params.set("query", query);
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-start gap-4 w-full"
    >
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-secondary-foreground" />
        <Input
          {...register("query", {
            required: "Search query cannot be empty",
          })}
          placeholder="Search inspiration"
          className={`pl-8 ${
            errors.query ? "ring-2 ring-red-500" : "focus:ring-2"
          } bg-secondary text-secondary-foreground focus:border-transparent placeholder:text-secondary-foreground`}
         
        />
        {errors.query && (
          <p className="text-red-500 text-sm mt-1">{errors.query.message}</p>
        )}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
  
}
