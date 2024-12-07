"use client";
import Link from "next/link";
import { useSearchParams, redirect } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function ProfileMenu() {
  const searchParams = useSearchParams();
  const display = searchParams.get("display");

  if (!display) {
    redirect("?display=projects");
  }

  const navItems = [
    { href: "?display=projects", label: "Projects" },
    { href: "?display=stats", label: "Statistics" },
    { href: "?display=bookmarks", label: "Bookmarks" },
    { href: "?display=appreciations", label: "Appreciations" },
    { href: "?display=drafts", label: "Drafts (2)" },
  ];

  return (
    <NavigationMenu className="space-x-4 text-muted-foreground w-full overflow-auto flex flex-nowrap p-8 justify-start">
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
