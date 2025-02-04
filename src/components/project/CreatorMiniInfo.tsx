"use client";
import Image from "next/image";
import rakesh from "@/media/rakesh.jpeg";
import Link from "next/link";
import { MiniUser } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
interface UserInfoProps {
  creator: MiniUser;
  styles?: string;
}

const CreatorMiniInfo: React.FC<UserInfoProps> = ({ creator, styles }) => {
  const { user } = useUser();
  return (
    <Link href={user?._id === creator?._id ? "/profile" : `/profile/${creator?._id}`}>
      <div className={cn("flex items-center gap-4", styles)}>
        <div className="w-12 h-12 rounded-full overflow-hidden relative">
          <Image
            fill
            src={creator?.avatar || rakesh}
            alt="Creator avatar"
            className="w-full h-full object-cover"
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
export default CreatorMiniInfo;
// https://creativespotlight.s3.eu-north-1.amazonaws.com/media/6734d491aa911275db54e114/21f1b7ce-c936-4923-b54f-da7947178e99.jpg