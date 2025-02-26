"use client";
import { useUser } from "@/contexts/UserContext";
import React, { memo, useState } from "react";
import { cn } from "@/lib/utils";
import MiniUserInfo from "../common/MiniUserInfo";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useCommentsOperations } from "@/features/comments/useCommentsOperations";

interface PostCommentProps {
    projectId: string;
}

const PostComment: React.FC<PostCommentProps> = ({ projectId }) => {
    const [isPosting, setIsPosting] = useState(false);
    const { user } = useUser();
    const { postComment } = useCommentsOperations();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ comment: string }>();

    const onSubmit = async (data: { comment: string }) => {
        setIsPosting(true);
        const { comment } = data;
        await postComment({ projectId, content: comment });
        reset();
        setIsPosting(false);
    };

    return user ? (
        <div className="flex space-x-4 items-start">
            {user && (
                <MiniUserInfo
                    id={user._id}
                    fullName={user.fullName.split(" ")[0]}
                    avatar={user.profile?.avatar || null}
                    styles="w-auto pr-4"
                />
            )}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <textarea
                        {...register("comment", { required: "Comment cannot be empty." })}
                        className={cn("border-2 resize-none p-2 w-full")}
                        placeholder="Show appreciation through kind words"
                        rows={5}
                    />
                    {errors.comment && (
                        <div className="text-red-500 text-sm">{errors.comment.message}</div>
                    )}
                    <Button type="submit" className="ml-auto relative block" disabled={isPosting}>
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    ) : (
        <div className="text-center">Please login to post a comment</div>
    );
};

export default memo(PostComment);