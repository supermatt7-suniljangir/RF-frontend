"use client";

import {ProjectType} from "@/types/project";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "../ui/card";
import PostComment from "./PostComment";
import CommentsList from "./CommentsList";
import {IComment} from "@/types/others";
import {useCommentsOperations} from "@/features/comments/useCommentsOperations";

interface CommentsContainerProps {
    project: ProjectType;
}

const CommentsContainer: React.FC<CommentsContainerProps> = ({project}) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const {fetchComments} = useCommentsOperations()
    useEffect(() => {
        const loadComments = async () => {
            try {
                const response = await fetchComments({projectId: project?._id});
                if (response?.success) {
                    setComments(response.data || []);
                } else {
                    setError(response?.message || "Failed to load comments");
                }
            } catch {
                setError("Failed to load comments");
            }
        };

        loadComments();
    }, [project._id, fetchComments]);

    return (
        <Card className="sm:w-5/6 w-[95%] mt-8 rounded-none">
            <CardHeader className="text-center">Remarks</CardHeader>
            <CardContent>
                <PostComment projectId={project._id} setComments={setComments}/>
                {error ? (
                    <p className="text-muted-foreground text-center my-4">{error}</p>
                ) : (
                    <CommentsList comments={comments} setComments={setComments}/>
                )}
            </CardContent>
        </Card>
    );
};

export default CommentsContainer;
