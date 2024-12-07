
import { getUserProjects } from "@/features/project/getUserProjects";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ProjectMini } from "@/types/project";
import ProfileData from "@/components/profile/ProfileData";
import { Suspense } from "react";
import Spinner from "@/app/loading";

export default async function Profile({
  searchParams,
}: {
  searchParams: Promise<{ display?: string }>;
}) {
  const { display } = await searchParams;
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  if (!authToken) {
    redirect("/login");
  }
  const projects: ProjectMini[] = await getUserProjects(authToken);
  if (!projects) {
    throw new Error("Failed to fetch user projects");
  }
  return (
    <Suspense fallback={<Spinner />}>
      <ProfileData display={display} projects={projects} />
    </Suspense>
  );
}
