"use client";
import Link from "next/link";
import {useSearchParams, redirect} from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import useIsExternalProfile from "@/hooks/useIsExternalProfile";
import {User} from "@/types/user";
import {memo} from "react";

function ProfileMenu({user}: { user: User | null }) {
    const searchParams = useSearchParams();
    const display = searchParams.get("display");
    const isExternalProfile = useIsExternalProfile(user) || false;
    if (!display) {
        redirect("?display=projects");
    }
    const navItems = [
        {href: "?display=projects", label: "Projects"},
        {href: "?display=appreciations", label: "Appreciations"},
    ];
    if (!isExternalProfile) {
        navItems.push({href: "?display=bookmarks", label: "Bookmarks"});
        navItems.push({href: "?display=drafts", label: "Drafts"});
    }
    return (
        <NavigationMenu
            className="space-x-4 text-muted-foreground w-full overflow-auto flex flex-nowrap p-8 justify-start">
            {navItems.map((item) => (
                <NavigationMenuItem key={item.href} className="flex-shrink-0">
                    <Link href={item.href} passHref legacyBehavior>
                        <NavigationMenuLink
                            className={cn(
                                "hover:text-foreground",
                                display === item.href.replace("?display=", "")
                                    ? "text-foreground underline underline-offset-4 font-semibold"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            ))}
        </NavigationMenu>
    );
}

export default memo(ProfileMenu);
