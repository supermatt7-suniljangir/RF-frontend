"use client";
import Image from "next/image";
import rakesh from "@/media/rakesh.jpeg";
import Link from "next/link";
import { User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";
interface UserInfoProps {
  creator: User;
}

const UserInfoMini: React.FC<UserInfoProps> = ({ creator }) => {
  const { user } = useUser();
  return (
    <Link href={user?._id === creator?._id ? "/profile" : `profile/${creator?._id}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden relative">
          <Image
            fill
            src={creator?.profile?.avatar || rakesh}
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
export default UserInfoMini;
