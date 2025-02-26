"use client";

import { useCallback } from "react";
import { revalidateTags } from "@/lib/revalidateTags";
import { useToast } from "@/hooks/use-toast";
import CommentsService from "@/services/clientServices/comments/CommentsService";

interface CommentPayload {
  projectId: string;
  content: string;
}

interface DeleteCommentPayload {
  projectId: string;
  commentId: string;
}

export function useCommentsOperations() {
  const { toast } = useToast();

  const postComment = useCallback(
    async ({ projectId, content }: CommentPayload): Promise<void> => {
      try {
        const response = await CommentsService.postComment({
          projectId,
          content,
        });

        revalidateTags([`comments-${projectId}`]);

        toast({
          title: "Comment Posted",
          description: response.message,
          duration: 5000,
        });
      } catch (error: any) {
        toast({
          title: "Error Posting Comment",
          description: error.message || "Failed to post comment",
          variant: "destructive",
          duration: 5000,
        });
      }
    },
    [toast]
  );

  const deleteComment = useCallback(
    async ({ projectId, commentId }: DeleteCommentPayload): Promise<void> => {
      try {
        const response = await CommentsService.deleteComment({
          projectId,
          commentId,
        });

        revalidateTags([`comments-${projectId}`]);

        toast({
          title: "Comment Deleted",
          description: response.message,
          duration: 5000,
        });
      } catch (error: any) {
        toast({
          title: "Error Deleting Comment",
          description: error.message || "Failed to delete comment",
          variant: "destructive",
          duration: 5000,
        });
      }
    },
    [toast]
  );

  return { postComment, deleteComment };
}
