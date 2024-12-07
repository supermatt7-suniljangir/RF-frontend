import { getUserProjects } from "@/features/project/getUserProjects";
import { Metadata } from "next";
import { ProjectMini } from "@/types/project";
import ProfileData from "@/components/profile/ProfileData";
import { Suspense } from "react";
import Spinner from "@/app/loading";
import { fetchProfileById } from "@/features/user/fetchProfileById";

interface ProfileProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ display?: string }>;
}
// Dynamic Metadata Generation
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const user = await fetchProfileById(params.id);

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
  const user = await fetchProfileById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const projects: ProjectMini[] = await getUserProjects(null, id);

  return (
    <Suspense fallback={<Spinner />}>
      <ProfileData display={display} projects={projects} user={user} />
    </Suspense>
  );
};

export default Profile;
