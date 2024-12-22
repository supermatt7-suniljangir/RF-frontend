import { MiniUser } from '@/types/user'
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

interface CreatorInfoProps {
    creator: MiniUser;
}
const CreatorInfo: React.FC<CreatorInfoProps> = ({ creator }) => {
    return (
        <div className="border relative w-full md:w-1/3 py-8 md:p-8 ">
            <Link href={`/profile/${creator._id}`} className='flex justify-center items-center flex-col gap-2 h-full'>
                <div className='relative w-36 h-36 border border- rounded-full flex flex-col'>
                    <Image src={creator.avatar} alt={creator.fullName} className='rounded-full object-cover' fill />
                </div>
                <h2 className='text-xl font-semibold'>{creator.fullName}</h2>
                <p className='text-lg'>{creator.profession}</p>
                <div className='space-x-4 text-sm'><span>{creator.followersCount} followers</span>
                    <span>{creator.projects.length} projects</span>
                </div>
            </Link>
        </div>
    )
}

export default CreatorInfo;