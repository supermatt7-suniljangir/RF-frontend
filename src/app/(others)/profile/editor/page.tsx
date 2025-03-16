"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import BasicInfoEdit from "@/components/profileEditor/BasicProfileEdit";
import SocialEdit from "@/components/profileEditor/SocialEdit";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";

const ProfileEditor: React.FC = () => {
  const { isLoading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("edit") || "basic";

  const handleTabChange = (tab: string) => {
    router.push(`/profile/editor?edit=${tab}`);
  };

  if (isLoading) return <Spinner />;

  return (
    <Card className="w-full max-w-3xl md:mt-8 mx-auto md:rounded-sm rounded-none">
      <div className="flex justify-between p-4  items-center">
        <Button
          variant="secondary"
          className="rounded-full w-8 h-8"
          onClick={() => router.push("/profile")}
        >
          <CircleArrowLeft />
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => handleTabChange("basic")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors bg-muted ",
              currentTab === "basic" && "bg-primary text-primary-foreground",
            )}
          >
            Basic Info
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleTabChange("social")}
            className={cn(
              "px-4 py-2  rounded-md text-sm font-medium bg-muted transition-colors ",
              currentTab === "social" && "bg-primary text-primary-foreground",
            )}
          >
            Social Links
          </Button>
        </div>
      </div>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Edit Profile</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {currentTab === "basic" ? <BasicInfoEdit /> : <SocialEdit />}
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
