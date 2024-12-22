import { IComment } from '@/types/project';
import React from 'react'
import MiniUserInfo from '../common/MiniUserInfo';
import { Card } from '../ui/card';
import { formatDate } from '@/lib/formateDate';

interface CommentProps {
  comment: IComment;
}


const Comment: React.FC<CommentProps> = ({ comment }) => {
  if (!comment || !comment.userData) return null;
  const { userData, content, createdAt } = comment;
  const date = formatDate(createdAt);
  return (
    <Card className='flex gap-2 flex-col p-4 items-start rounded-none'>
      <MiniUserInfo styles={"scale-110 ml-2"} avatar={userData?.avatar} id={userData?.userId} fullName={userData?.fullName} />
      <p>{content}</p>
      <span className='text-xs text-secondary-foreground'>{date}</span>
    </Card>
  )
}

export default Comment