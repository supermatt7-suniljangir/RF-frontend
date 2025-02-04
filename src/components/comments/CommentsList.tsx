"use client";
import { IComment } from '@/types/others';
import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { Button } from '../ui/button';

interface CommentsListProps {
    comments: IComment[];
}

const COMMENTS_PER_PAGE = 3;

const CommentsList: React.FC<CommentsListProps> = ({ comments }) => {
    const [displayCount, setDisplayCount] = useState(COMMENTS_PER_PAGE);
    const [displayedComments, setDisplayedComments] = useState<IComment[]>([]);

    // Reset pagination when comments array changes (e.g., new comment added)
    useEffect(() => {
        setDisplayCount(COMMENTS_PER_PAGE);
        setDisplayedComments(comments.slice(0, COMMENTS_PER_PAGE));
    }, [comments]);

    const handleLoadMore = () => {
        const newDisplayCount = displayCount + COMMENTS_PER_PAGE;
        setDisplayCount(newDisplayCount);
        setDisplayedComments(comments.slice(0, newDisplayCount));
    };

    if (!comments.length) return <div>No comments yet</div>;

    return (
        <div className="mt-4 py-2 border-t-2">
            <div className="space-y-4">
                {displayedComments.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                ))}
            </div>

            <div className='flex justify-center flex-col'>
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
                        variant='ghost'
                        onClick={() => {
                            setDisplayCount(COMMENTS_PER_PAGE);
                            setDisplayedComments(comments.slice(0, COMMENTS_PER_PAGE));
                        }}
                        className="mt-4 block px-4 py-2 text-base"
                    >
                        Show Less
                    </Button>
                )}




            </div>
        </div>
    );
};

export default CommentsList;