"use client";
import { Pencil, AtSign, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import Social from "./Social";
import { useUser } from "@/contexts/UserContext";
import Spinner from "@/app/loading";
import { redirect } from "next/navigation";

export default function UserProfileInfo() {
  const { user: authUser, isLoading } = useUser();
  if (isLoading) return <Spinner />;
  if (!authUser) redirect("/login?redirect=/profile");

  return (
    <div className="flex flex-col space-x-4 w-full relative items-center lg:items-start text-center lg:text-left space-y-4">
      <div className="w-20 h-20 lg:w-24 lg:h-24 relative -mt-12 lg:ml-4">
        <Image
          fill
          src={authUser.profile?.avatar}
          alt={authUser.fullName}
          className="rounded-full"
        />
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-xl">{authUser.fullName}</h3>
        <div>
          <Link href={`mailto:${authUser.email}`}>
            <AtSign size={16} className="inline" />{" "}
            {authUser.email}
          </Link>
        </div>
        {authUser.profile?.website && (
          <div>
            <Link
              href={authUser.profile.website}
              target="_blank"
            >
              <SquareArrowOutUpRight className="inline" size={14} />
              Website
            </Link>
          </div>
        )}
      </div>

      <Link href="/profile/editor" className="w-full">
        <Button
          variant="outline"
          className="bg-secondary text-secondary-foreground text-lg lg:w-5/6 md:w-2/4 w-3/4 rounded-full"
        >
          <Pencil />
          Edit Profile
        </Button>
      </Link>

      <div className="space-x-4 flex items-center">
        <Label htmlFor="availableForHire" className="text-lg font-semibold">
          Available for hire?
        </Label>
        <Switch
          id="availableForHire"
          defaultChecked={authUser.profile?.availableForHire}
          className="scale-x-125 scale-y-125 checked:bg-primary"
        />
      </div>

      <div className="!mt-8 w-[95%] p-4 lg:p-0">
        <h2 className="text-muted-foreground font-bold uppercase">About</h2>
        <p className="text-wrap">
          {authUser.profile?.bio}
        </p>
      </div>

      <Social socials={authUser.profile?.social} />
    </div>
  );
}