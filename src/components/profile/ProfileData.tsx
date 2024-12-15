
import React from 'react'
import UserProfileInfo from './UserProfileInfo'
import ExternalProfileInfo from './ExternalProfileInfo'
import ProfileMenu from './ProfileMenu'
import ProfileProjects from './ProfileProjects'
import Statistics from './Statistics'
import { ProjectMini } from '@/types/project'
import { User } from '@/types/user'
import ExternalProfileBanner from './ExternalProfileBanner'
import UserProfileBanner from './UserProfileBanner'

interface ProfileDataProps {
    display: string;
    projects: ProjectMini[] | null;
    user?: User;
}

const ProfileData: React.FC<ProfileDataProps> = ({ display, projects, user }) => {
    // receiving the user prop indicates that the profile is external, otherwise it's the user's profile
    return (
        <div>
            {user ? (
                <ExternalProfileBanner cover={user?.profile?.cover} />
            ) : (
                <UserProfileBanner />
            )}
            {/* <ProfileBanner cover={user ? user.profile.cover : null} /> */}
            <div className="grid grid-cols-1 lg:grid-cols-6 w-full">
                <div className="lg:px-4 lg:col-span-2">
                    {user ? (
                        <ExternalProfileInfo user={user!} />
                    ) : (
                        <UserProfileInfo />
                    )}
                </div>
                <div className="lg:col-span-4 place-items-center lg:place-items-start w-full">
                    <ProfileMenu />
                 
                    {display === "projects" && (
                        <ProfileProjects projects={projects} />
                    )}
                    {display === "stats" && (
                        <Statistics user={user ? user : null} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileData