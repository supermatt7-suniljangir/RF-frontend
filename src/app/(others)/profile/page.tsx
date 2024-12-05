"use client";
import Spinner from "@/app/loading";
import ProfileBanner from "@/components/profile/ProfileBanner";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProjects from "@/components/profile/ProfileProjects";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useUser } from "@/contexts/UserContext";
import { ProjectMini } from "@/types/project";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";
import Statistics from "@/components/profile/Statistics";

const Profile = () => {
  const { user, isLoading } = useUser();

  const searchParams = useSearchParams();
  const display = searchParams.get("display");
  if (isLoading) return <Spinner />;
  if (!user) redirect("/login?redirect=/profile");
  const projects: ProjectMini[] = [
    {
      _id: "1",
      title: "Modern UI Design",
      thumbnail: "https://example.com/thumbnail1.jpg",
      stats: {
        views: 1500,
        likes: 320,
        comments: 45,
      },
      featured: true,
      publishedAt: new Date("2024-01-15"),
      status: "published",
    },
    {
      _id: "2",
      title: "E-Commerce Dashboard",
      thumbnail: "https://example.com/thumbnail2.jpg",
      stats: {
        views: 800,
        likes: 120,
        comments: 20,
      },
      featured: false,
      publishedAt: new Date("2023-12-01"),
      status: "draft",
    },
    {
      _id: "3",
      title: "Travel Blog Landing Page",
      thumbnail: "https://example.com/thumbnail3.jpg",
      stats: {
        views: 2500,
        likes: 450,
        comments: 90,
      },
      featured: true,
      publishedAt: new Date("2024-02-20"),
      status: "published",
    },
    {
      _id: "4",
      title: "Fitness App Interface",
      thumbnail: "https://example.com/thumbnail4.jpg",
      stats: {
        views: 1200,
        likes: 210,
        comments: 30,
      },
      featured: false,
      publishedAt: new Date("2024-01-10"),
      status: "draft",
    },
    {
      _id: "5",
      title: "Portfolio Showcase",
      thumbnail: "https://example.com/thumbnail5.jpg",
      stats: {
        views: 3000,
        likes: 520,
        comments: 150,
      },
      featured: true,
      publishedAt: new Date("2024-03-01"),
      status: "published",
    },
  ];
  return (
    <div>
      <ProfileBanner cover={user?.profile?.cover} />
      <div className="grid grid-cols-1 lg:grid-cols-6 w-full">
        <div className="lg:px-4 lg:col-span-2">
          <ProfileInfo user={user} />
        </div>
        {/* sidebar */}
        <div className="lg:col-span-4 lg:pl-12 place-items-center lg:place-items-start w-full">
          <ProfileMenu />

          {projects.length > 0 && display === "projects" && (
            <ProfileProjects projects={projects} />
          )}
          {display === "stats" && <Statistics />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
