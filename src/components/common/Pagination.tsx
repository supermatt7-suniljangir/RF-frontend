"use client";
import { PaginationMetadata, SearchParams } from '@/types/common';
import Link from 'next/link';

interface PaginationProps {
    metadata: PaginationMetadata;  // Server response structure
    props: SearchParams;           // Query parameters for search
}

const Pagination: React.FC<PaginationProps> = ({ metadata, props }) => {
    const { page, pages, hasNextPage, hasPrevPage } = metadata;
    const { query, limit, sortBy = "createdAt", sortOrder = "desc", category, type = "project" } = props;
    const createPageUrl = (targetPage: number) => {
        const queryParams = new URLSearchParams();
       if(query) queryParams.set("query", query);
        queryParams.set("page", targetPage.toString());
        if (limit) queryParams.set("limit", limit.toString());
        if (sortBy && sortBy !== "createdAt") queryParams.set("sortBy", sortBy);
        if (sortOrder) queryParams.set("sortOrder", sortOrder);
        if (type) queryParams.set("type", type);
        if (category) queryParams.set("category", category);
        return `?${queryParams.toString()}`;
    };


    // Generate visible page numbers (maximum 5)
    const visiblePages = Array.from(
        { length: Math.min(pages, 5) },
        (_, i) => Math.max(1, page - 2) + i
    ).filter(p => p <= pages);

    return (
        <div className="flex justify-center items-center space-x-2 my-4">
            {hasPrevPage && (
                <Link
                    href={createPageUrl(page - 1)}
                    className="py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 text-center w-20"
                >
                    Previous
                </Link>
            )}
            {visiblePages.map(p => (
                <Link
                    key={p}
                    href={createPageUrl(p)}
                    className={`px-3 py-1 rounded ${p === page
                        ? 'bg-primary text-primary-foreground pointer-events-none'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                >
                    {p}
                </Link>
            ))}
            {hasNextPage && (
                <Link
                    href={createPageUrl(page + 1)}
                    className=" py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 w-20 text-center"
                >
                    Next
                </Link>
            )}
        </div>
    );
};

export default Pagination;
