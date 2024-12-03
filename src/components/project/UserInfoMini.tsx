import Image from "next/image";
import rakesh from "@/media/rakesh.jpeg";
import Link from "next/link";
// components/ProjectHeader/UserInfo.tsx
interface UserInfoProps {
  creator: string;
}

const UserInfoMini: React.FC<UserInfoProps> = ({ creator }) => {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden relative">
          <Image
            fill
            src={rakesh}
            alt="Creator avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-medium">Peppermint</h2>
          <p className="text-sm text-green-500">Available for work</p>
        </div>
      </div>
    </Link>
  );
};
export default UserInfoMini;
