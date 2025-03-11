"use client";

import {useCallback} from "react";
import {useToast} from "@/hooks/use-toast";
import CommentsService from "@/services/clientServices/comments/CommentsService";
import {IComment} from "@/types/others";
import {ApiResponse} from "@/types/ApiResponse";

interface CommentPayload {
    projectId: string;
    content: string;
}

interface DeleteCommentPayload {
    projectId: string;
    commentId: string;
}

interface FetchCommentsPayload {
    projectId: string;
}

export function useCommentsOperations() {
    const {toast} = useToast();

    // ✅ Post Comment
    const postComment = useCallback(
        async ({projectId, content}: CommentPayload): Promise<IComment> => {
            try {
                const response = await CommentsService.postComment({
                    projectId,
                    content,
                });
                toast({
                    title: "Comment Posted",
                    description: response.message,
                    duration: 5000,
                });
                return response.data;
            } catch (error) {
                toast({
                    title: "Error Posting Comment",
                    description: error.message || "Failed to post comment",
                    variant: "destructive",
                    duration: 5000,
                });
                throw error;
            }
        },
        [toast]
    );

    // ✅ Delete Comment
    const deleteComment = useCallback(
        async ({projectId, commentId}: DeleteCommentPayload): Promise<void> => {
            try {
                const response = await CommentsService.deleteComment({
                    projectId,
                    commentId,
                });

                toast({
                    title: "Comment Deleted",
                    description: response.message,
                    duration: 5000,
                });
            } catch (error) {
                toast({
                    title: "Error Deleting Comment",
                    description: error.message || "Failed to delete comment",
                    variant: "destructive",
                    duration: 5000,
                });
                throw error;
            }
        },
        [toast]
    );

    // ✅ Fetch Comments (newly added)
    const fetchComments = useCallback(
        async ({projectId}: FetchCommentsPayload): Promise<ApiResponse> => {
            try {
                const response = await CommentsService.getComments({projectId});
                return response;
            } catch (error) {
                throw error;
            }
        },
        [toast]
    );

    return {postComment, deleteComment, fetchComments};
}
