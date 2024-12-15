"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProfileCard from "../common/UserProfileCard";
import { ProjectMini } from "@/types/project";
import { MiniUser } from "@/types/user";
import ProjectCard from "../common/ProjectCard";
import Spinner from "@/app/loading";
import Pagination from "@/components/common/Pagination"; // Assuming the Pagination component exists
import { useSearch } from "@/features/search/useSearch";
import { toast } from "@/hooks/use-toast";
import { PaginationMetadata } from "@/types/common";
import Sort from "./Sort";
import Filters from "./Fitler";

const SearchResults = () => {
    const searchParams = useSearchParams();
    const { searchUsers, searchProjects, error, isLoading } = useSearch();
    const query = searchParams.get("query");
    const tag = searchParams.get("tag");
    const type = searchParams.get("type") as "project" | "user";
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const filter = searchParams.get("filter");
    const [projects, setProjects] = useState<ProjectMini[] | null>([]);
    const [users, setUsers] = useState<MiniUser[] | null>([]);
    const resultsRef = useRef<HTMLDivElement | null>(null);

    const [pagination, setPagination] = useState<PaginationMetadata>({
        total: 0,
        page: 1,
        pages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    useEffect(() => {
        if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        if (!category && !type && !query && !tag) {
            // Use searchProjects but don't pass any query, tag, or category
            searchProjects({ page, sortBy, sortOrder, filter })
                .then((response) => {
                    if (!response || !response.pagination || !response.data) return;
                    setProjects(response.data);
                    setPagination(response.pagination);
                })
                .catch((error) => {
                    console.error("Error fetching projects:", error);
                    toast({
                        variant: "destructive",
                        title: "Error fetching projects",
                        description: error.message || "Failed to fetch projects.",
                    });
                });
        } else if (type !== "user" && (query || category || tag)) {
            searchProjects({ page, query, sortBy, sortOrder, category, tag, filter })
                .then((response) => {
                    if (!response || !response.pagination || !response.data) return;
                    setProjects(response.data);
                    setUsers([]);
                    setPagination(response.pagination);
                });
        } else if (type === "user" && query) {
            searchUsers({ page, query, sortBy, sortOrder, filter })
                .then((response) => {
                    if (!response || !response.pagination || !response.data) return;
                    setUsers(response.data);
                    setProjects([]);
                    setPagination(response.pagination);
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                    toast({
                        variant: "destructive",
                        title: "Error fetching users",
                        description: error.message || "Failed to fetch users.",
                    });
                });
        }
    }, [query, type, category, page, tag, sortBy, sortOrder, filter]);


    const renderResults = () => {
        if (isLoading) return <Spinner />;

        if (type === "user" && users?.length > 0) {
            return (
                <div>
                    <div className="flex flex-wrap gap-4 py-2 justify-center">
                        {users.map((user) => (
                            <ProfileCard key={user?._id} user={user} />
                        ))}
                    </div>
                    {pagination.pages > 1 && (
                        <Pagination
                            metadata={pagination}
                            props={{ query, type, sortBy, sortOrder, page }} // Pass the full props object
                        />
                    )}
                </div>
            );
        }

        if (projects && projects?.length > 0) {
            return (
                <div >
                    <div className="flex flex-wrap gap-2 justify-center p-2 flex-row">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))}

                    </div>
                    {pagination.pages > 1 && (
                        <Pagination
                            metadata={pagination}
                            props={{ query, type, sortBy, sortOrder, page }} // Pass the full props object
                        />
                    )}
                </div>
            );
        }

        // Fallback for no results
        return (
            <div className="text-center m-8">
                <h3 className="text-2xl font-semibold">No results found</h3>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <p className="text-lg mt-2">Try searching with popular tags</p>
            </div>
        );
    };

    return (
        <div>
            {(projects?.length > 0 || users?.length > 0) && <div className="md:p-8 p-4 flex justify-between"><Sort />        <Filters />
            </div>}
            <h2 className="text-lg text-center">
                Search Results for: <b>{query || "Explore"}</b>
            </h2>
            <div ref={resultsRef}>{renderResults()}</div>
        </div>
    );
};

export default SearchResults;

