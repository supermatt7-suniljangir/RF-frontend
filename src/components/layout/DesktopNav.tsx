import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  CircleUserRound,
  LogInIcon,
  LogOutIcon,
  Mail,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/layout/ModeToggle";
import React from "react";

const DesktopNav = () => {
  const { user, logout } = useUser();

  return (
    <nav className="w-full border-b">
      <div className=" mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" className="text-xl font-semibold">
              <Image src={`/logo.svg`} alt={"logo"} width={60} height={30} />
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Explore
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="">
                    <div className="grid w-[300px] p-4 shadow-lg">
                      <Link
                        href={`/search?tag=Figma`}
                        className="block p-2 "
                      >
                        Figma Design
                      </Link>
                      <Link
                        className="block p-2"
                        href={`/search?category=Graphic+Design`}
                      >
                        Graphic Design
                      </Link>
                      <Link
                        className="block p-2 "
                        href={`/search?category=Illustration`}
                      >
                        Illustration
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Profile & Activity
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] p-4 shadow-lg">
                      <Link href={`/profile`} className="block p-2">
                        Profile
                      </Link>
                      <Link
                        href={`/profile?display=appreciation`}
                        className="block p-2"
                      >
                        My Appreciations
                      </Link>
                      <Link
                        href={`/profile?display=bookmarks`}
                        className="block p-2"
                      >
                        Bookmarked Projects
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <Link href={`/project/editor/new`}>
                  {" "}
                  <Button variant={"outline"}>
                    <Plus /> Publish a Project
                  </Button>
                </Link>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-6">
            {/* <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 " />
              <Input
                placeholder="Search inspiration"
                className="pl-8  focus:ring-2  focus:border-transparent"
              />
            </div> */}
            <Link href={"/search"}>
              <Search className="!h-5 !w-5" />
            </Link>

            {user && (
              <Link href={`/connect`}>
                <Mail />
              </Link>
            )}
            <ModeToggle />

            <Link href={"/profile"} className="inline-block w-6 h-6 relative">
              {user?.profile?.avatar ? (
                <Image
                  src={user.profile.avatar}
                  className="rounded-full object-cover"
                  fill
                  alt={user.fullName}
                />
              ) : (
                <CircleUserRound className="!h-5 !w-5" />
              )}
            </Link>
            {user ? (
              <Button
                className="bg-secondary text-secondary-foreground"
                onClick={logout}
              >
                Logout <LogOutIcon />
              </Button>
            ) : (
              <Link href="/login">
                <Button className="bg-secondary text-secondary-foreground">
                  login <LogInIcon />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default DesktopNav;
