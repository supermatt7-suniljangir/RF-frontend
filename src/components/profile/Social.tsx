import React from "react";
import {Card} from "@/components/ui/card";
import XIcon from "@/media/x.svg";
import GithubIcon from "@/media/github.svg";
import LinkedInIcon from "@/media/linkedin.svg";
import InstagramIcon from "@/media/instagram.svg";
import FacebookIcon from "@/media/facebook.svg";
import Image from "next/image";
import {ExternalLink} from "lucide-react";
import {Social as SocialType} from "@/types/user";

const Social = ({socials}: { socials: SocialType }) => {
    const links = [
        {
            href: socials?.twitter || "https://x.com",
            icon: XIcon,
            alt: "X/Twitter",
            exists: socials?.twitter,
        },
        {
            href: socials?.github || "https://github.com",
            icon: GithubIcon,
            alt: "GitHub",
            exists: socials?.github,
        },
        {
            href: socials?.linkedin || "https://linkedin.com",
            icon: LinkedInIcon,
            alt: "LinkedIn",
            exists: socials?.linkedin,
        },
        {
            href: socials?.instagram || "https://instagram.com",
            icon: InstagramIcon,
            alt: "Instagram",
            exists: socials?.instagram,
        },
        {
            href: socials?.facebook || "https://facebook.com",
            icon: FacebookIcon,
            alt: "Facebook",
            exists: socials?.facebook,
        },
    ];
    return (
        <div className="w-3/4 flex justify-around items-center flex-col">
            {links.map((link) => {
                if (!link.exists) return null;
                return <Card
                    className="w-full rounded-sm px-8 py-1 hover:bg-muted hover:text-muted-foreground"
                    key={link.href}
                >
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-2 space-x-4 items-center w-full"
                    >
                        <Image width={24} height={24} src={link.icon} alt="Twitter"/>
                        <span className="text-center">{link.alt}</span>
                        <ExternalLink className="!ml-auto relative"/>
                    </a>
                </Card>
            })}
        </div>
    );
};

export default Social;
