"use client";
import Image from "next/image";
import rakesh from "@/media/rakesh.jpeg";
import Link from "next/link";
import { MiniUser } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { memo } from "react";
interface UserInfoProps {
  creator: MiniUser;
  styles?: string;
}

const CreatorMiniInfo: React.FC<UserInfoProps> = ({ creator, styles }) => {
  const { user } = useUser();
  return (
    <Link
      href={
        user?._id === creator?._id ? "/profile" : `/profile/${creator?._id}`
      }
      target="_blank"
    >
      <div className={cn("flex items-center gap-4", styles)}>
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image
            fill
            src={creator?.profile.avatar || rakesh}
            alt="Creator avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-medium">{creator?.fullName}</h2>
          <p className="text-sm text-green-500">Available for work</p>
        </div>
      </div>
    </Link>
  );
};
export default memo(CreatorMiniInfo);
