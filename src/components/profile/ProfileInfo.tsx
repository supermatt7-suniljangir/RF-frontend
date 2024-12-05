// components/ProfileInfo.tsx
"use client";
import { User } from "@/types/user";
import {
  AtSign,
  Check,
  Mail,
  Pencil,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import Social from "./Social";
import { useState } from "react";
import MessageModal from "./MessageModal";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function ProfileInfo({ user }: { user: User | null }) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user: authUser } = useUser();
  return (
    <div className="flex flex-col space-x-4 w-full relative items-center lg:items-start text-center lg:text-left space-y-4">
      <div className="w-20 h-20 lg:w-24 lg:h-24 relative -mt-12 lg:ml-4">
        <Image
          fill
          src={user?.profile?.avatar || "https://something.com/dfd.png"}
          alt="Sunil Jangid"
          className="rounded-full"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-xl">{user?.fullName}</h3>
        <div>
          <Link href={`mailto:${user?.email}`}>
            <AtSign size={16} className="inline" /> {user?.email}
          </Link>
        </div>
        {!user?.profile?.website && (
          <div>
            <Link href="https://suniljangid.in" target="_blank">
              <SquareArrowOutUpRight className="inline" size={14} /> website
            </Link>
          </div>
        )}
      </div>
      {/* availability for work*/}
      {/* for visitors */}
      <div className="flex space-x-2 items-center text-green-500">
        <h2 className="text-lg font-semibold">Available for hire </h2> <Check />
      </div>
      <Link href={"/profile/editor"} className="w-full">
        <Button
          variant={"outline"}
          className="bg-secondary text-secondary-foreground text-lg lg:w-5/6 md:w-2/4 w-3/4 rounded-full"
        >
          <Pencil />
          Edit Profile
        </Button>
      </Link>
      <Button
        className="text-lg lg:w-5/6 md:w-2/4 rounded-full w-3/4"
        onClick={() => {
          if (authUser) setIsModalOpen(true);
          else {
            toast({
              duration: 5000,
              title: "Invalid Action",
              description: "You need to login to send a message",
              variant: "destructive",
            });
          }
        }}
      >
        <Mail /> Message
      </Button>
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => setIsModalOpen(false)}
      />
      {/* availbility for work */}
      {/* for profile owner */}
      <div className="space-x-4 flex items-center">
        <Label htmlFor="availableForHire" className="text-lg font-semibold">
          Available for hire?
        </Label>
        <Switch
          id="availableForHire"
          defaultChecked
          className="scale-x-125 scale-y-125 checked:bg-primary"
        />
      </div>

      <div className="!mt-8 w-[95%] p-4 lg:p-0">
        <h2 className="text-muted-foreground font-bold uppercase">About</h2>
        <p className=" text-wrap">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
          error consequuntur mollitia atque earum a blanditiis exercitationem
          nisi impedit itaque! Mollitia nemo quam voluptates ipsum adipisci
          magni ipsam enim veniam sit delectus minima beatae, libero sed
          assumenda in rerum cum iste perspiciatis rem commodi. Nesciunt quaerat
          labore nulla ipsam iure consequuntur, ea quasi autem sed architecto
          totam iste odit officia tempora inventore temporibus praesentium
          itaque reiciendis eligendi unde voluptas consequatur dicta! Incidunt
        </p>
      </div>

      {/* social */}
      <Social />
    </div>
  );
}
