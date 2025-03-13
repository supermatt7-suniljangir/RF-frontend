"use client";
import {useState, useCallback} from "react";
import {
    SearchParams,
} from "@/types/common";
import SearchService from "@/services/clientServices/search/search";

// Helper function to clean params
const cleanParams = (params: SearchParams): SearchParams => {
    const cleanedParams: SearchParams = {page: params.page};
    Object.keys(params).forEach((key) => {
        if (
            (typeof params[key] === "string" && params[key].trim() !== "") ||
            (typeof params[key] === "number" && params[key] !== undefined)
        ) {
            cleanedParams[key] = params[key];
        }
    });
    return cleanedParams;
};

// Helper function to build query string
const buildQueryString = (params: SearchParams): string => {
    return Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        )
        .join("&");
};

export function useSearch() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchUsers = useCallback(
        async (params: SearchParams, signal?: AbortSignal) => {
            setLoading(true);
            setError(null);
            try {
                const cleanedParams = cleanParams(params);
                const queryString = buildQueryString(cleanedParams);
                return await SearchService.fetchUsers(queryString, signal);
            } catch (err) {
                setError(err.message || "Error occurred while searching for users.");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const searchProjects = useCallback(async (params: SearchParams) => {
        setLoading(true);
        setError(null);
        try {
            const cleanedParams = cleanParams(params);
            const queryString = buildQueryString(cleanedParams);
            return await SearchService.fetchProjects(queryString);
        } catch (err) {
            setError(err.message || "Error occurred while searching for projects.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        searchUsers,
        searchProjects,
    };
}
