"use client";
import React, { memo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { IComment } from "@/types/others";
import { useCommentsOperations } from "@/features/comments/useCommentsOperations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostCommentProps {
  projectId: string;
  setComments: (update: (prev: IComment[]) => IComment[]) => void;
}

const PostComment: React.FC<PostCommentProps> = ({
  projectId,
  setComments,
}) => {
  const [text, setText] = useState("");
  const { user } = useUser();
  const { postComment } = useCommentsOperations();
  const handlePostComment = async () => {
    if (!text.trim() || !user) return;

    try {
      // Make API call
      const newComment = await postComment({ projectId, content: text });

      // ✅ Cast response to IComment type manually
      const comment: IComment = {
        _id: newComment._id,
        content: text,
        projectId,
        author: {
          userId: user._id, // Assuming user object has _id field
          fullName: user.fullName,
          avatar: user?.profile?.avatar || undefined,
        },
        createdAt: new Date(newComment.createdAt),
        updatedAt: new Date(newComment.updatedAt),
      };

      // ✅ Ensure type matches `setComments`
      setComments((prev) => [comment, ...prev]);
      setText(""); // Clear input
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="w-full h-24 resize-none bg-background text-foreground border border-input px-4 py-2 rounded-md focus:border-none focus:outline-none "
      />
      <Button
        onClick={handlePostComment}
        className="h-10 px-6 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Post
      </Button>
    </div>
  );
};

export default memo(PostComment);
