"use client";
import React, {useEffect, useState, useCallback, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useUser} from "@/contexts/UserContext";
import {User} from "@/types/user";
import {useFollowOperations} from "@/features/follow/useFollowOperations";

interface FollowButtonProps {
    className?: string;
    user?: User;
    size?: "small" | "large";
}

const FollowDetails: React.FC<FollowButtonProps> = ({
                                                        size = "small",
                                                        user,
                                                        className,
                                                    }) => {
    const {user: currentUser, isLoading} = useUser();
    const {checkFollowStatus, toggleFollowUser} = useFollowOperations();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [followersCount, setFollowersCount] = useState<number>(
        user?.followersCount ?? currentUser?.followersCount ?? 0
    );
    const [isPending, startTransition] = useTransition();

    const isExternalProfile = Boolean(user);

    // Initial follow status check
    useEffect(() => {
        let isMounted = true;

        const fetchFollowStatus = async () => {
            if (!currentUser || !isExternalProfile || !user?._id) return;

            const response = await checkFollowStatus(user._id);
            if (isMounted) {
                setIsFollowing(response);
            }
        };

        fetchFollowStatus();

        return () => {
            isMounted = false;
        };
    }, [currentUser, user, isExternalProfile, checkFollowStatus]);

    const handleFollowToggle = useCallback(async () => {
        if (isPending || isLoading || !currentUser || !user?._id) return;

        startTransition(async () => {
            const previousFollowing = isFollowing;
            const previousCount = followersCount;

            // Optimistic update
            setIsFollowing(!previousFollowing);
            setFollowersCount((prev) => Math.max(0, prev + (!previousFollowing ? 1 : -1)));

            try {
                await toggleFollowUser(user._id);
            } catch (err) {
                // Revert on error
                setIsFollowing(previousFollowing);
                setFollowersCount(previousCount);
            }
        });
    }, [user?._id, isFollowing, isPending, isLoading, currentUser, followersCount, toggleFollowUser]);

    // Render current user's follow stats
    if (!isExternalProfile) {
        return (
            <div className="w-full text-center md:text-start">
                {followersCount} Followers • {currentUser?.followingCount ?? 0} Following
            </div>
        );
    }

    // Render external user's profile with follow button
    return (
        <div className="flex items-start flex-col relative h-auto space-y-2">
            <div className={`w-full text-center md:text-start`}>
                {followersCount} Followers • {user?.followingCount ?? 0} Following
            </div>
            <Button
                onClick={handleFollowToggle}
                disabled={isPending || isLoading || !currentUser}
                variant="outline"
                className={cn("w-full", className)}
            >
                {isFollowing ? "Following" : "Follow"}
            </Button>
        </div>
    );
};

export default FollowDetails;
