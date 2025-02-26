"use server";

import { Metadata } from "next";
import { MiniProject } from "@/types/project";
import ProfileData from "@/components/profile/ProfileData";
import { Suspense } from "react";
import Spinner from "@/app/loading";
import { getProfileProjectsAPI } from "@/services/serverServices/profile/getProfileProjects";
import { getProfileById } from "@/services/serverServices/profile/getProfileById";
import { ApiResponse } from "@/lib/ApiResponse";

interface ProfileProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ display?: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const userRes: ApiResponse = await getProfileById(id);

  if (!userRes.success || !userRes.data) {
    return {
      title: "Profile Not Found",
      description: "The requested user profile could not be found",
    };
  }

  const user = userRes.data;

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

  const userRes: ApiResponse = await getProfileById(id);
  if (!userRes.success || !userRes.data) {
    return (
      <p className="text-red-500">
        {userRes.message || "User not found"}
      </p>
    );
  }
  const user = userRes.data;

  const profileProjectsRes: ApiResponse = await getProfileProjectsAPI(id);
  const projects: MiniProject[] = profileProjectsRes.success ? profileProjectsRes.data : [];

  return (
    <Suspense fallback={<Spinner />}>
      <ProfileData display={display} projects={projects} user={user} />
    </Suspense>
  );
};

export default Profile;
