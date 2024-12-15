import { Metadata } from "next";
import { ProjectMini } from "@/types/project";
import ProfileData from "@/components/profile/ProfileData";
import { Suspense } from "react";
import Spinner from "@/app/loading";
import { getUserProjectsApi } from "@/services/users/getUserProjects";
import { getProfileById } from "@/services/users/getProfileById";

interface ProfileProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ display?: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const user = await getProfileById(id);

  if (!user) {
    return {
      title: "Profile Not Found",
      description: "The requested user profile could not be found",
    };
  }

  return {
    title: user.fullName,
    description: user.profile?.bio || "User profile",

    openGraph: {
      title: user.fullName,
      description: user.profile?.bio || "User profile",
      images: [
        {
          url: user.profile?.avatar || "/default-avatar.png",
          width: 400,
          height: 400,
          alt: user.fullName,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: user.fullName,
      description: user.profile?.bio || "User profile",
      images: [user.profile?.avatar || "/default-avatar.png"],
    },
  };
}


const Profile: React.FC<ProfileProps> = async ({ params, searchParams }) => {
  const { id } = await params;
  const { display } = await searchParams;
  const user = await getProfileById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const projects: ProjectMini[] = await getUserProjectsApi(id);

  return (
    <Suspense fallback={<Spinner />}>
      <ProfileData display={display} projects={projects} user={user} />
    </Suspense>
  );
};

export default Profile;
