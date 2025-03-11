"use server";
import {URL} from "@/api/config/configs";
import {ApiResponse} from "@/types/ApiResponse";
import {cookies} from "next/headers";

//  this function is used to get the recent conversations(the list of people you have interacted with)
export const getRecentConversations = async (): Promise<ApiResponse> => {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const authToken = cookieStore.get("auth_token")?.value;
        if (!authToken) {
            return {success: false, message: "Not authenticated"};
        }
        const url = `${URL}/connect/conversations`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader,
            },
            next: {
                tags: [`conversations`],
                revalidate: 60 * 60,
            },
        });

        const result: ApiResponse = await response.json();
        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Failed to fetch liked projects",
            };
        }

        return result;
    } catch (error) {
        console.error("Error fetching liked projects:", error.message);
        return {success: false, message: error.message};
    }
};
