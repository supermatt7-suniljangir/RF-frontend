"use client";
import { useUser } from "@/contexts/UserContext";
import React from "react";
import { cn } from "@/lib/utils";
import MiniUserInfo from "../common/MiniUserInfo";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";

interface PostCommentProps {
    projectId: string;
}

const PostComment: React.FC<PostCommentProps> = ({ projectId }) => {
    const { user } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<{ comment: string }>(); // Directly use react-hook-form

    const onSubmit = (data: { comment: string }) => {
        const { comment } = data;
        console.log(`Project ID: ${projectId}, Comment: ${comment}`);
        reset();
    };

    return user ? (
        <div className="flex space-x-4 items-start">
            {user && (
                <MiniUserInfo
                    id={user._id}
                    fullName={user.fullName}
                    avatar={user.profile.avatar}
                    styles="w-auto pr-4"
                />
            )}
            <div className="w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <textarea
                        {...register("comment", { required: "Comment cannot be empty." })} // Register with validation
                        className={cn("border-2 resize-none p-2 w-full")}
                        placeholder="Show appreciation through kind words"
                        rows={5}
                    />
                    {errors.comment && (
                        <div className="text-red-500 text-sm">{errors.comment.message}</div> // Display error message
                    )}
                    <Button type="submit" className="ml-auto relative block">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    ) : (
        <div className="text-center">Please login to post a comment</div>
    );
};

export default PostComment;
