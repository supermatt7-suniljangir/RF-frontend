"use client";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Search, LogInIcon, LogOutIcon, CircleUserRound, Mail, Plus, Menu, X} from "lucide-react";
import {useUser} from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";
import {ModeToggle} from "./ModeToggle";

const MobileNav = () => {
    const {user, logout} = useUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full border-b">
            <div className="w-full px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="text-xl font-semibold">
                        Logo
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href={"/search"}>
                            <Search className="h-5 w-5"/>
                        </Link>
                        {user && (
                            <Link href={`/connect`}>
                                <Mail className="h-5 w-5"/>
                            </Link>
                        )}
                        <ModeToggle/>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div
                    className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background shadow-md z-50 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {/* Explore Section */}
                        <div className="border-b border-muted pb-4">
                            <h3 className="font-semibold">Explore</h3>
                            <div className="flex flex-col mt-2">
                                <Link href={`/search?category=Web+Design`}
                                      className="block p-2 rounded-md hover:bg-muted">
                                    Web Design
                                </Link>
                                <Link href={`/search?category=Graphic+Design`}
                                      className="block p-2 rounded-md hover:bg-muted">
                                    Graphic Design
                                </Link>
                                <Link href={`/search?category=Illustration`}
                                      className="block p-2 rounded-md hover:bg-muted">
                                    Illustration
                                </Link>
                            </div>
                        </div>

                        {/* Profile & Activity Section */}
                        <div className="border-b border-muted pb-4">
                            <h3 className="font-semibold">Profile & Activity</h3>
                            <div className="flex flex-col mt-2">
                                <Link href={`/profile`} className="block p-2 rounded-md hover:bg-muted">
                                    Profile
                                </Link>
                                <Link href={`/profile?display=appreciation`}
                                      className="block p-2 rounded-md hover:bg-muted">
                                    My Appreciations
                                </Link>
                                <Link href={`/profile?display=bookmarks`}
                                      className="block p-2 rounded-md hover:bg-muted">
                                    Bookmarked Projects
                                </Link>
                            </div>
                        </div>

                        {/* Publish Button */}
                        <div>
                            <Link href={`/project/editor/new`}>
                                <Button variant="outline" className="w-full">
                                    <Plus className="mr-2"/> Publish a Project
                                </Button>
                            </Link>
                        </div>

                        {/* Auth Buttons */}
                        <div>
                            {user ? (
                                <Button
                                    className="w-full bg-secondary text-secondary-foreground"
                                    onClick={logout}
                                >
                                    Logout <LogOutIcon className="ml-2"/>
                                </Button>
                            ) : (
                                <Link href="/login">
                                    <Button className="w-full bg-secondary text-secondary-foreground">
                                        Login <LogInIcon className="ml-2"/>
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MobileNav;
