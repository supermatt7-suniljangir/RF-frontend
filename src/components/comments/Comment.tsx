"use client";
import { IComment } from "@/types/others";
import React, { useState, useCallback, memo } from "react";
import MiniUserInfo from "../common/MiniUserInfo";
import { Card } from "../ui/card";
import { formatDate } from "@/lib/formateDate";
import { useUser } from "@/contexts/UserContext";
import DeleteCommentModal from "./DeleteCommentModal";
import { useCommentsOperations } from "@/features/comments/useCommentsOperations";

interface CommentProps {
  comment: IComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useUser();
  const { deleteComment } = useCommentsOperations();
  const loggedinUserId = user?._id;

  if (!comment?.author) return null;

  const { author, content, createdAt, projectId, _id: commentId } = comment;
  const date = formatDate(createdAt);

  const handleDeleteComment = useCallback(async () => {
    setIsDeleting(true);
    await deleteComment({ projectId, commentId });
    setIsDeleting(false);
    setIsOpen(false);
  }, [deleteComment, projectId, commentId]);

  return (
    <Card className="rounded-none flex items-center justify-between">
      <div className="flex gap-2 flex-col p-4 items-start">
        <MiniUserInfo
          styles="scale-110 ml-2"
          avatar={author.avatar}
          id={author.userId}
          fullName={author.fullName}
        />
        <p>{content}</p>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>

      {author.userId === loggedinUserId && (
        <DeleteCommentModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isDeleting={isDeleting}
          handleDeleteComment={handleDeleteComment}
        />
      )}
    </Card>
  );
};

export default memo(Comment);
