
"use client";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  // Upload,
  // Bell,
  Menu,
  X,
  LogInIcon,
  LogOutIcon,
  CircleUserRound,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { user, logout } = useUser();

  return (
    <nav className="w-full border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-xl font-semibold">
              Logo
            </a>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="">
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=""
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="py-4 space-y-4 ">
              {/* Navigation Selects */}
              <div className="space-y-3">
                <Select>
                  <SelectTrigger className="w-full border-gray-200 ">
                    <SelectValue placeholder="Inspiration" />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-inner">
                    <SelectGroup>
                      <SelectLabel>Discover</SelectLabel>
                      <SelectItem value="trending">Browse Trending</SelectItem>
                      <SelectItem value="noteworthy">
                        New & Noteworthy
                      </SelectItem>
                      <SelectItem value="featured">
                        Featured Projects
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full border-gray-200">
                    <SelectValue placeholder="Find Work" />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-lg">
                    <SelectGroup>
                      <SelectLabel>Opportunities</SelectLabel>
                      <SelectItem value="jobs">Job Board</SelectItem>
                      <SelectItem value="freelance">
                        Freelance Projects
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-full border-gray-200">
                    <SelectValue placeholder="Learn Design" />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-lg">
                    <SelectGroup>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="workshops">Workshops</SelectItem>
                      <SelectItem value="tutorials">Tutorials</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button className="w-full">Share Work</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const DesktopNav = () => {
  const { user, logout } = useUser();

  return (
    <nav className="w-full border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" className="text-xl font-semibold">
              Logo
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Explore
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="">
                    <div className="grid w-[300px] p-4 shadow-lg">
                      <NavigationMenuLink className="block p-2 hover:bg-primary hover:text-primary-foreground">
                        Browse Trending
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 ">
                        New & Noteworthy
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 ">
                        Featured Projects
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-semibold">
                    Find Work
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[300px] p-4 shadow-lg">
                      <NavigationMenuLink className="block p-2 ">
                        Job Board
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block p-2 ">
                        Freelance Projects
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-6">
            {/* <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 " />
              <Input
                placeholder="Search inspiration"
                className="pl-8 border-gray-200 focus:ring-2  focus:border-transparent"
              />
            </div> */}
            <Link href={"/search"}>
              <Search className="h-5 w-5" />
            </Link>

            <Link href={"/profile"}>
              <CircleUserRound className="h-5 w-5" />
            </Link>
            <ModeToggle />

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
                  Login / Register <LogInIcon />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Navbar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <DesktopNav /> : <MobileNav />;
};

export default Navbar;
