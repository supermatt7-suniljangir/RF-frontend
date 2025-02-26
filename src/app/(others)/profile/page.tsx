"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ProfileData from "@/components/profile/ProfileData";
import { Suspense } from "react";
import Spinner from "@/app/loading";
import { getProfileProjectsAPI } from "@/services/serverServices/profile/getProfileProjects";
import { ApiResponse } from "@/lib/ApiResponse";

interface ProfileProps {
  searchParams: Promise<{ display?: string }>;
}

export default async function Profile({ searchParams }: ProfileProps) {
  const { display } = await searchParams;
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    redirect("/login");
  }

  const projectsRes: ApiResponse = await getProfileProjectsAPI();

  if (!projectsRes.success || !projectsRes.data) {
    console.error("Failed to fetch user projects:", projectsRes.message);
    return (
      <div className="text-center text-red-500">
        {projectsRes.message || "Failed to fetch user projects"}
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <ProfileData display={display} projects={projectsRes.data} />
    </Suspense>
  );
}
