"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import CommentsService from "@/services/clientServices/comments/CommentsService";
import { IComment } from "@/types/others";
import { ApiResponse } from "@/types/ApiResponse";

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
  const { toast } = useToast();
  const [isProcessingCommentOperation, setIsProcessingCommentOperation] =
    useState(false);
  // ✅ Post Comment
  const postComment = useCallback(
    async ({ projectId, content }: CommentPayload): Promise<IComment> => {
      try {
        setIsProcessingCommentOperation(true);
        const response = await CommentsService.postComment({
          projectId,
          content,
        });
        return response.data;
      } catch (error) {
        toast({
          title: "Error Posting Comment",
          description: error?.message || "Failed to post comment",
          variant: "destructive",
          duration: 5000,
        });
        throw error;
      } finally {
        setIsProcessingCommentOperation(false);
      }
    },
    [],
  );

  // ✅ Delete Comment
  const deleteComment = useCallback(
    async ({ projectId, commentId }: DeleteCommentPayload): Promise<void> => {
      try {
        setIsProcessingCommentOperation(true);

        await CommentsService.deleteComment({
          projectId,
          commentId,
        });
      } catch (error) {
        toast({
          title: "Error Deleting Comment",
          description: error?.message || "Failed to delete comment",
          variant: "destructive",
          duration: 5000,
        });
        throw error;
      } finally {
        setIsProcessingCommentOperation(false);
      }
    },
    [],
  );

  // ✅ Fetch Comments (newly added)
  const fetchComments = useCallback(
    async ({
      projectId,
    }: FetchCommentsPayload): Promise<ApiResponse<IComment[]>> => {
      try {
        setIsProcessingCommentOperation(true);

        const response: ApiResponse<IComment[]> =
          await CommentsService.getComments({ projectId });
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsProcessingCommentOperation(false);
      }
    },
    [],
  );

  return {
    postComment,
    deleteComment,
    fetchComments,
    isProcessingCommentOperation,
  };
}
