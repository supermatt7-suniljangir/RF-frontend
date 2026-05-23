"use client";
import { Pencil, AtSign, SquareArrowOutUpRight, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

import Social from "./Social";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import ProfilePlaceholder from "@/media/user.png";
import FollowDetails from "./FollowDetails";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfileInfo() {
  const { user: authUser, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.replace("/login?redirect=/profile");
    }
  }, [isLoading, authUser, router]);

  if (isLoading || !authUser) {
    return <Spinner />;
  }

  return (
    <div className="relative flex w-full flex-col items-center space-x-4 space-y-4 text-center lg:items-start lg:text-left">
      <div className="relative -mt-12 h-20 w-20 rounded-full border-2 border-primary lg:ml-4 lg:h-24 lg:w-24">
        {authUser.profile?.avatar ? (
          <Image
            fill
            priority
            unoptimized
            src={authUser.profile?.avatar}
            alt={authUser.fullName}
            className="rounded-full object-cover"
          />
        ) : (
          <Image
            fill
            src={ProfilePlaceholder}
            alt={authUser.fullName}
            className="rounded-full object-cover"
          />
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{authUser.fullName}</h3>
        <div>
          <Link href={`mailto:${authUser.email}`}>
            <AtSign size={16} className="inline" /> {authUser.email}
          </Link>
        </div>
        {authUser.profile?.profession && (
          <div>
            <Settings size={16} className="inline" />{" "}
            {authUser.profile.profession}
          </div>
        )}
        {authUser.profile?.website && (
          <div>
            <Link href={authUser.profile.website} target="_blank">
              <SquareArrowOutUpRight className="inline" size={14} /> Website
            </Link>
          </div>
        )}
        <FollowDetails />
      </div>

      <Link href="/profile/editor" className="w-full">
        <Button
          variant="outline"
          className="w-3/4 rounded-full bg-secondary text-lg text-secondary-foreground md:w-2/4 lg:w-5/6"
        >
          <Pencil />
          Edit Profile
        </Button>
      </Link>

      <div className="!mt-8 w-[95%] p-4 lg:p-0">
        <h2 className="font-bold uppercase text-muted-foreground">About</h2>
        <p className="text-wrap">{authUser.profile?.bio}</p>
      </div>

      <Social socials={authUser.profile?.social} />
    </div>
  );
}
