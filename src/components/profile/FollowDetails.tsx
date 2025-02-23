"use client";
import React, { useEffect, useState, useCallback, useTransition } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { checkFollowStatus } from "@/services/follow/checkFollowStatus";
import { toggleFollowUser } from "@/services/follow/toggleFollowUser";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types/user";

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
    const { user: currentUser,refreshUser, isLoading } = useUser();
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const isExternalProfile: boolean = user ? true : false
    const [followersCount, setFollowersCount] = useState<number>(
        user ? user.followersCount : currentUser?.followersCount
    );
    const [isPending, startTransition] = useTransition();


    useEffect(() => {
        let isMounted = true;

        const fetchFollowStatus = async () => {
            if (!currentUser || !isExternalProfile || !user?._id) return;

            if (isMounted) {
                const response = await checkFollowStatus(user._id);
                setIsFollowing(response);
            }

        };

        fetchFollowStatus();

        return () => {
            isMounted = false;
        };
    }, [currentUser, user, isExternalProfile, isLoading]);

    const onClickHandler = useCallback(() => {
        if (isPending || isLoading || !currentUser || !user?._id) return;

        startTransition(async () => {
            const optimisticFollowing = !isFollowing;
            setIsFollowing(optimisticFollowing);
            setFollowersCount((prev) => Math.max(0, prev + (optimisticFollowing ? 1 : -1)));

            try {
                await toggleFollowUser(user._id);
                await refreshUser();
            } catch (err) {
                setIsFollowing(!optimisticFollowing);
                setFollowersCount((prev) => Math.max(0, prev - (optimisticFollowing ? 1 : -1)));
                toast({
                    title: "Failed to toggle follow status",
                    description: "Please try again later.",
                    variant: "destructive",
                });
            }
        });
    }, [user, isFollowing, isPending, isLoading, currentUser]);

    if (!isExternalProfile) {
        return (
            <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                    {followersCount} Followers • {currentUser?.followingCount || 0} Following
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-start flex-col relative h-auto space-y-2">
          <div>
          <span className="text-sm text-muted-foreground">
                    {followersCount} Followers • {user?.followingCount || 0} Following
                </span>
          </div>
            <Button
                onClick={onClickHandler}
                disabled={isPending || isLoading || !currentUser}
                variant="outline"
                className="w-full"
            >
                <p >{isFollowing ? "Following" : "Follow"}</p>
            </Button>

        </div>
    );
};

export default FollowDetails;
