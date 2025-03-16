"use client";
import { IComment } from "@/types/others";
import React, { useState, useCallback, memo } from "react";
import Comment from "./Comment";
import { Button } from "../ui/button";

interface CommentsListProps {
  comments: IComment[];
  setComments: (comments: IComment[]) => void;
}

const COMMENTS_PER_PAGE = 3;

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  setComments,
}) => {
  const [displayCount, setDisplayCount] = useState(COMMENTS_PER_PAGE);

  // Displayed comments are computed from the state
  const displayedComments = comments.slice(0, displayCount);

  const handleLoadMore = useCallback(() => {
    setDisplayCount((prev) => prev + COMMENTS_PER_PAGE);
  }, []);

  const handleShowLess = useCallback(() => {
    setDisplayCount(COMMENTS_PER_PAGE);
  }, []);

  if (!comments.length) return <div>No comments yet</div>;

  return (
    <div className="mt-4 py-2 border-t-2">
      <div className="space-y-4">
        {displayedComments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            setComments={setComments}
          />
        ))}
      </div>

      <div className="flex justify-center flex-col">
        {displayCount < comments.length && (
          <Button
            onClick={handleLoadMore}
            className="mt-4 px-4 w-full text-base bg-muted py-4 text-muted-foreground hover:text-primary-foreground"
          >
            Show More
          </Button>
        )}

        {displayCount > COMMENTS_PER_PAGE && (
          <Button
            variant="ghost"
            onClick={handleShowLess}
            className="mt-4 block px-4 py-2 text-base"
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(CommentsList);
