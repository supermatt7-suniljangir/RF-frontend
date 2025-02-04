"use client";

import { IComment } from '@/types/others';
import React, { useState } from 'react';
import MiniUserInfo from '../common/MiniUserInfo';
import { Card } from '../ui/card';
import { formatDate } from '@/lib/formateDate';

import { useUser } from '@/contexts/UserContext';
import { deleteComment } from '@/services/comments/deleteComment';
import DeleteCommentModal from './DeleteCommentModal';


interface CommentProps {
  comment: IComment;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const [isDeleting, setIsDeleting] = useState(false); // Track delete in progress
  const [isOpen, setIsOpen] = useState(false); // Track Dialog open state
  const { user } = useUser();
  const { _id: loggedinUserId } = user || {};

  if (!comment || !comment.author) return null;

  const { author, content, createdAt } = comment;
  const date = formatDate(createdAt);

  const handleDeleteComment = async () => {
    setIsDeleting(true); // Disable button and show loader
    await deleteComment({ projectId: comment.projectId, commentId: comment._id });
    setIsDeleting(false); // Re-enable after deletion
    setIsOpen(false); // Close the dialog after deleting
  };

  return (
    <Card className='rounded-none flex items-center justify-between'>
      <div className='flex gap-2 flex-col p-4 items-start'>
        <MiniUserInfo
          styles={"scale-110 ml-2"}
          avatar={author?.avatar}
          id={author?.userId}
          fullName={author?.fullName}
        />
        <p>{content}</p>
        <span className='text-xs text-muted-foreground'>{date}</span>
      </div>

{/* the button which triggers the delete is in DeleteCommentModal */}
      {comment.author.userId === loggedinUserId && (
       <DeleteCommentModal isOpen={isOpen} setIsOpen={setIsOpen} isDeleting={isDeleting} handleDeleteComment={handleDeleteComment} />
      )}
    </Card>
  );
};

export default Comment;
