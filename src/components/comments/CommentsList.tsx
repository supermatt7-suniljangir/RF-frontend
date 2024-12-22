import { IComment } from '@/types/project';
import React from 'react'
import Comment from './Comment';

interface CommentsListProps {
    comments: IComment[];
}


const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
    
    if(!comments.length) return <div>No comments yet</div>
    return (
        <div className='mt-4 py-2 border-t-2'>
            {comments.map((comment) => <Comment key={comment.content} comment={comment} />)}
        </div>
    )
}

export default CommentsList