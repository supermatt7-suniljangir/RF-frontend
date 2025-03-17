"use client";
import React, {useEffect, useRef, useState} from "react";
import {useSearchParams} from "next/navigation";
import ProfileCard from "../common/UserProfileCard";
import {MiniProject} from "@/types/project";
import {MiniUser} from "@/types/user";
import ProjectCard from "../common/ProjectCard";
import Spinner from "@/app/loading";
import Pagination from "@/components/common/Pagination"; // Assuming the Pagination component exists
import {useSearch} from "@/features/search/useSearch";
import {toast} from "@/hooks/use-toast";
import {PaginationMetadata} from "@/types/common";
import Sort from "./Sort";
import Filters from "./Fitler";

const SearchResults = () => {
    // const pathname = usePathname();
    // const isSearchPage = pathname === "/search";
    const searchParams = useSearchParams();
    const {
        searchUsers,
        searchProjects,
        loading: isLoading,
        error,
    } = useSearch();
    const query = searchParams.get("query");
    const tag = searchParams.get("tag");
    const type = searchParams.get("type") as "project" | "user";
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const filter = searchParams.get("filter");
    const [projects, setProjects] = useState<MiniProject[] | null>([]);
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
        const fetchData = async () => {
            try {
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
                // Fetch all projects if no query or filters
                if (!category && !type && !query && !tag) {
                    // Fetch all projects without filters
                    const response = await searchProjects({
                        page,
                        sortBy,
                        sortOrder,
                        filter,
                        limit: 9,
                    });
                    if (!response?.pagination || !response?.data) return;
                    setProjects(response.data);
                    setPagination(response.pagination);
                    setUsers([]);
                }

                // fetch projects
                else if (type !== "user" && (query || category || tag)) {
                    // Fetch filtered projects
                    const response = await searchProjects({
                        page,
                        query,
                        sortBy,
                        sortOrder,
                        category,
                        tag,
                        filter,
                        limit: 9,
                    });
                    if (!response?.pagination || !response?.data) return;
                    setProjects(response.data);
                    setPagination(response.pagination);
                    setUsers([]);
                }
                // fetch users
                else if (type === "user" && query) {
                    // Fetch users
                    const response = await searchUsers({
                        page,
                        query,
                        sortBy,
                        sortOrder,
                        filter,
                        limit: 9,
                    });
                    if (!response?.pagination || !response?.data) return;
                    setUsers(response.data);
                    setPagination(response.pagination);
                    setProjects([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    variant: "destructive",
                    title: "Error fetching data",
                    description: error.message || "Failed to fetch data.",
                });
            }
        };

        fetchData();
    }, [query, type, category, page, tag, sortBy, sortOrder, filter]);

    const renderResults = () => {
        if (isLoading) return <Spinner/>;

        if (type === "user" && users?.length > 0) {
            return (
                <div>
                    <div className="flex flex-wrap gap-4 py-2 justify-center">
                        {users.map((user) => (
                            <ProfileCard key={user?._id} user={user}/>
                        ))}
                    </div>
                    {pagination.pages > 1 && (
                        <Pagination
                            metadata={pagination}
                            props={{query, type, sortBy, sortOrder, page}} // Pass the full props object
                        />
                    )}
                </div>
            );
        }

        if (projects && projects?.length > 0) {
            return (
                <div>
                    <div className="flex flex-wrap gap-4 justify-center p-2 flex-row">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project}/>
                        ))}
                    </div>
                    {pagination.pages > 1 && (
                        <Pagination
                            metadata={pagination}
                            props={{query, type, sortBy, sortOrder, page}} // Pass the full props object
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
        <div className="flex-grow">
            {(projects?.length > 0 || users?.length > 0) && (
                <div className=" px-4 md:px-8 py-4 flex relative w-fit ml-auto gap-4 md:gap-8">
                    <Sort/> {(query || category || tag) && <Filters/>}
                </div>
            )}
            <h2 className="text-xl font-semibold text-center my-2">
                {type === "user"
                    ? `Users matching "${query}"`
                    : query || category || tag
                        ? `Projects matching "${query || category || tag}"`
                        : "Featured"}
            </h2>
            <div ref={resultsRef}>{renderResults()}</div>
        </div>
    );
};

export default SearchResults;
