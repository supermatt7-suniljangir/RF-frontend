import { cn } from '@/lib/utils';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import user from "@/media/user.png";

interface MiniUserInfoProps {
    id: string;
    avatar: string;
    fullName: string;
    styles?: string;
}
const MiniUserInfo: React.FC<MiniUserInfoProps> = ({ id, avatar, fullName, styles }) => {
    return (
        <Link href={`/profile/${id}`} className={cn("block", styles)}>
            <div className="flex space-x-2 relative items-center">
                <Image
                    src={avatar ? avatar : user}
                    alt={fullName}
                    width={30}
                    height={30}
                    className="rounded-full w-7 h-7 object-cover"
                />
                <p>{fullName}</p>
            </div>
        </Link>
    )
}

export default MiniUserInfo