import React from "react";
import UserProfileInfo from "./UserProfileInfo";
import ExternalProfileInfo from "./ExternalProfileInfo";
import ProfileMenu from "./ProfileMenu";
import PublishedProjects from "./PublishedProjects";
import { MiniProject } from "@/types/project";
import { User } from "@/types/user";
import ExternalProfileBanner from "./ExternalProfileBanner";
import UserProfileBanner from "./UserProfileBanner";
import Bookmarks from "./Bookmarks";
import DraftProjects from "./DraftProjects";
import AppreciatedProjects from "./AppreciatedProjects";

interface ProfileDataProps {
  display: string | undefined;
  projects: MiniProject[] | null;
  user?: User;
}

const ProfileData: React.FC<ProfileDataProps> = ({
  display,
  projects,
  user,
}) => {
  // receiving the user prop indicates that the profile is external, otherwise it's the user's profile
  return (
    <div>
      {user ? (
        <ExternalProfileBanner cover={user?.profile?.cover} />
      ) : (
        <UserProfileBanner />
      )}
      {/* <ProfileBanner cover={user ? user.profile.cover : null} /> */}
      <div className="grid w-full grid-cols-1 lg:grid-cols-6">
        <div className="lg:col-span-2 lg:px-4">
          {user ? <ExternalProfileInfo user={user!} /> : <UserProfileInfo />}
        </div>
        <div className="w-full place-items-center lg:col-span-4 lg:place-items-start">
          <ProfileMenu user={user || null} />

          {display === "projects" && <PublishedProjects projects={projects} />}
          {/* {display === "stats" && <Statistics user={user ? user : null} />} */}
          {display === "bookmarks" && !user && <Bookmarks />}
          {display === "drafts" && !user && (
            <DraftProjects projects={projects} />
          )}
          {display === "appreciations" && (
            <AppreciatedProjects user={user ? user : null} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
